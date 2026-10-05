(function () {
  'use strict';

  var WA_NUMBER = '24174635940';
  var chat = document.getElementById('chat');
  var toggle = document.getElementById('chat-toggle');
  var body = document.getElementById('chat-body');
  var chipsBox = document.getElementById('chat-chips');
  var form = document.getElementById('chat-form');
  var input = document.getElementById('chat-input');
  var fab = document.getElementById('fab');
  var started = false;

  function waLink(text) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
  }
  function waButton(text, label) {
    return '<a class="chat__cta" href="' + waLink(text) + '" target="_blank" rel="noopener">' + (label || 'Continuer sur WhatsApp') + '</a>';
  }
  var DEVIS_WA = "Bonjour, je souhaite une présentation de la proposition de plateforme pour la transition SEEG.";

  // Base de connaissances issue du dossier complet SEEG (5 octobre 2026)
  var KB = [
    { id: 'bonjour', keys: ['bonjour', 'bonsoir', 'salut', 'hello', 'coucou', 'bjr'],
      answer: "Bonjour et bienvenue ! Je peux vous renseigner sur la <strong>SEEG</strong>, la réforme du 1er janvier 2027, les coupures ou la plateforme proposée. Que souhaitez-vous savoir ?" },
    { id: 'services', keys: ['service', 'plateforme', 'proposition', 'propose', 'niveau', 'fonction', 'prestation', 'offre', 'que faites', 'faites quoi', 'vous faites'],
      answer: "La plateforme proposée comporte <strong>trois niveaux</strong> :<ul><li><strong>Sites de la transition</strong> : portail, deux sites neufs, info coupures, agences</li><li><strong>Espace client</strong> : contrat, EDAN et factures, alertes, signalements</li><li><strong>Gestion interne</strong> : incidents, délestages, réclamations, fraude, tableau de bord</li></ul>",
      chips: ['Info coupures', 'Espace client', 'Gestion interne', 'Feuille de route'] },
    { id: 'seeg', keys: ['seeg', 'societe d energie', 'presentation', 'qui etes', 'entreprise', 'actionnaire', 'capital social', 'chiffre', 'perte', 'milliard', 'arsee', 'regulat', 'tutelle', 'ministere'],
      answer: "La <strong>SEEG</strong> assure la production, le transport, la distribution et la vente d'électricité et d'eau potable. L'État en détient 56 % via le Fonds souverain. En 2024 : <strong>212,6 milliards FCFA</strong> de chiffre d'affaires et <strong>45,6 milliards FCFA</strong> de perte nette. Tutelle : ministère de l'Accès universel à l'Eau et à l'Énergie ; régulateur : ARSEE.",
      chips: ['La réforme', 'Info coupures'] },
    { id: 'reforme', keys: ['reforme', 'scission', 'transition', 'disparait', 'disparaitre', 'fin de la seeg', '2027', 'janvier', 'gabonaise des eaux', 'electricite du gabon', 'societes', 'actions prioritaires', 'comite'],
      answer: "La SEEG <strong>cessera d'exister le 31 décembre 2026</strong>. Dès le <strong>1er janvier 2027</strong>, deux sociétés d'économie mixte la remplacent :<ul><li><strong>La Gabonaise des Eaux</strong> : eau potable</li><li><strong>Électricité du Gabon</strong> : électricité</li></ul>Le Conseil des ministres a adopté les deux lois le 25 juin 2026 ; une feuille de route de six mois (vingt actions prioritaires) a été présentée le 31 juillet. Un comité présidé par le Chef de l'État pilote la réforme.",
      chips: ['Mon contrat', 'Info coupures'] },
    { id: 'contrat', keys: ['contrat', 'abonne', 'ancien numero', 'nouveau numero', 'retrouve', 'quelle societe', 'a qui m adresser', 'client'],
      answer: "Avec <strong>« Je retrouve mon contrat »</strong>, le client saisirait son ancien numéro SEEG et verrait sa nouvelle société, son nouveau numéro de contrat et ses canaux de paiement. C'est l'assistant de transition prévu pour le 1er janvier 2027.",
      chips: ['Feuille de route', 'Paiement EDAN'] },
    { id: 'coupures', keys: ['coupure', 'delest', 'panne', 'courant', 'lumiere', 'noir', 'avarie', 'gasoil', 'carburant', 'penurie', 'bisseg', 'owendo', 'karpowership', 'quartier'],
      answer: "Chronologie récente :<ul><li><strong>13 septembre 2026</strong> : avarie sur la ligne 90 kV Bisségué–Owendo, délestages dans le Grand Libreville</li><li><strong>2 octobre 2026</strong> : pénurie de gasoil, délestages tournants et perturbations de l'eau</li></ul>La page <strong>« Info coupures »</strong> proposée publierait les délestages par quartier, en temps réel, avec des alertes.",
      chips: ['Espace client', 'Signaler une panne'] },
    { id: 'signaler', keys: ['signal', 'fraude', 'vol de cable', 'sabotage', 'piratage', 'denonc', 'declarer', 'incident'],
      answer: "Le client pourrait <strong>signaler une panne</strong> (photo, localisation) ou <strong>une fraude / un vol de câble</strong>, anonymement si besoin, avec un numéro de suivi. En interne, les signalements géolocalisés sont affectés aux équipes puis clôturés avec photo.",
      chips: ['Gestion interne', 'Info coupures'] },
    { id: 'paiement', keys: ['paiement', 'payer', 'edan', 'facture', 'prepay', 'unite', 'recharge', 'moov', 'airtel', 'bgfi', 'bicig', 'mobile money'],
      answer: "Aujourd'hui, EDAN et les factures se règlent en agence ou par Mobile Money (Moov Money, Airtel Money, BGFI Mobile, Bicig Mobile). L'<strong>espace client</strong> proposé réunirait achat d'EDAN et paiement des factures en un seul endroit, avec historique et reçus.",
      chips: ['Espace client', 'Alertes'] },
    { id: 'client', keys: ['espace client', 'niveau 2', 'alerte', 'sms', 'reclamation', 'raccordement', 'abonnement'],
      answer: "L'<strong>espace client</strong> (niveau 2), mobile d'abord :<ul><li>Retrouver mon contrat</li><li>Acheter EDAN et payer mes factures</li><li>Alertes SMS/WhatsApp : coupure, retour du courant ou de l'eau, crédit bas</li><li>Signaler une panne ou une fraude</li><li>Abonnement, raccordement, réclamation avec suivi</li></ul>" },
    { id: 'interne', keys: ['gestion interne', 'niveau 3', 'interne', 'tableau de bord', 'technicien', 'exploitation', 'indicateur', 'qualite de service'],
      answer: "La <strong>gestion interne</strong> (niveau 3), avec accès selon le rôle pour chaque société : gestion des incidents, plan de délestage publié automatiquement, suivi des réclamations par agence, fraude et sécurité du réseau, et tableau de bord pour la direction et le ministère." },
    { id: 'roadmap', keys: ['feuille de route', 'calendrier', 'planning', 'delai', 'quand', 'date', 'etape', 'mise en ligne', 'combien de temps'],
      answer: "Le calendrier proposé suit celui de la réforme :<ul><li><strong>Oct.–déc. 2026</strong> : portail de transition, info coupures, FAQ</li><li><strong>1er janvier 2027</strong> : sites des deux sociétés, « Je retrouve mon contrat »</li><li><strong>1er trimestre 2027</strong> : espace client</li><li><strong>2027</strong> : gestion interne et indicateurs publics</li></ul>" },
    { id: 'benchmark', keys: ['benchmark', 'compar', 'autres pays', 'ma cie', 'cie ', 'woyofal', 'senelec', 'eneo', 'myeasylight', 'coupure.ci', 'cote d ivoire', 'senegal', 'cameroun', 'exemple', 'inspir'],
      answer: "Références retenues : <strong>Ma CIE</strong> (Côte d'Ivoire, signalement d'incidents), <strong>Senelec Woyofal</strong> (Sénégal, prépaiement et alertes), <strong>Eneo MyEasyLight</strong> (Cameroun, agence en ligne, coupures annoncées 72 h à l'avance) et <strong>coupure.ci</strong> (recensement citoyen des coupures)." },
    { id: 'plus', keys: ['difference', 'innov', 'ussd', 'sans internet', 'carte', 'temps reel', 'transparence', 'le plus'],
      answer: "Ce qui ferait la différence : une <strong>carte des coupures en temps réel</strong>, l'<strong>assistant de transition</strong>, des <strong>indicateurs publics de qualité</strong>, une version <strong>SMS/USSD</strong> sans internet et le signalement des vols et sabotages avec suivi." },
    { id: 'agences', keys: ['agence', 'point de vente', 'ou etes', 'ou se trouve', 'adresse', 'siege', 'localisation', 'bureau'],
      answer: "La plateforme proposée inclurait une <strong>carte des agences et points de vente EDAN</strong>, avec numéros d'urgence. Pour joindre la SEEG aujourd'hui, consultez seeg-gabon.com.",
      chips: ['La plateforme', 'Contact'] },
    { id: 'dirigeants', keys: ['dirige', 'dirigeant', 'directeur', 'administrateur', 'legnongo', 'tonangoye', 'ministre', 'president', 'responsable', 'patron'],
      answer: "<strong>Steeve Saurel Legnongo</strong> est administrateur de la SEEG (cité comme administrateur provisoire en juin 2026), chargé de la transition. <strong>Philippe Tonangoye</strong>, ministre de l'Accès universel à l'Eau et à l'Énergie, a présenté la feuille de route ; le Président <strong>Brice Clotaire Oligui Nguema</strong> préside le comité de pilotage de la réforme." },
    { id: 'devis', keys: ['devis', 'prix', 'tarif', 'cout', 'budget', 'combien', 'chiffrage', 'cher', 'montant'],
      answer: "Le chiffrage dépend du périmètre retenu (niveau 1, 2 ou 3) et sera établi avec la direction de la SEEG. Demandez une présentation :<br>" + waButton(DEVIS_WA, 'Demander une présentation') + '<a class="chat__link" href="#contact" data-close>ou remplir le formulaire</a>' },
    { id: 'contact', keys: ['contact', 'telephone', 'numero vert', 'appeler', 'joindre', 'mail', 'email', 'courriel', 'whatsapp', 'parler', 'humain', 'conseiller', 'rappeler', 'rouana'],
      answer: "Cette proposition est portée par <strong>Rouana</strong> :<ul><li>Tél. : <a href=\"tel:+24174635940\">+241 74 63 59 40</a></li><li>E-mail : <a href=\"mailto:contact@rouana.com\">contact@rouana.com</a></li></ul>Pour joindre la SEEG elle-même, rendez-vous sur seeg-gabon.com." + waButton("Bonjour, je souhaite être recontacté au sujet de la plateforme SEEG.", 'Écrire sur WhatsApp') },
    { id: 'officiel', keys: ['officiel', 'vrai site', 'maquette', 'proposition de'],
      answer: "Ce site est une <strong>proposition de plateforme</strong> et une maquette de travail présentées à la SEEG : ce n'est pas le site officiel de l'entreprise. Le site officiel actuel est seeg-gabon.com." },
    { id: 'merci', keys: ['merci', 'au revoir', 'bye', 'a bientot', 'parfait', 'super', 'ok merci'],
      answer: "Avec plaisir ! N'hésitez pas si vous avez d'autres questions." }
  ];

  var CHIP_MAP = {
    'La plateforme': 'services', 'La réforme': 'reforme', 'Info coupures': 'coupures', 'Espace client': 'client',
    'Gestion interne': 'interne', 'Feuille de route': 'roadmap', 'Mon contrat': 'contrat', 'Paiement EDAN': 'paiement',
    'Alertes': 'client', 'Signaler une panne': 'signaler', 'Contact': 'contact', 'Demander une présentation': 'devis'
  };
  var DEFAULT_CHIPS = ['La réforme', 'Info coupures', 'La plateforme', 'Feuille de route', 'Contact'];

  function norm(s) {
    return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9+ ]/g, ' ').replace(/\s+/g, ' ');
  }

  function findAnswer(q) {
    var t = ' ' + norm(q) + ' ';
    var best = null, bestScore = 0;
    KB.forEach(function (e) {
      var score = 0;
      e.keys.forEach(function (k) { if (t.indexOf(' ' + k) !== -1) score += k.length > 5 ? 2 : 1; });
      // Les salutations ne l'emportent que si la question ne contient rien d'autre
      if (e.id === 'bonjour' && score) score = 0.5;
      if (score > bestScore) { bestScore = score; best = e; }
    });
    return best;
  }

  function addMsg(html, who) {
    var m = document.createElement('div');
    m.className = 'chat__msg chat__msg--' + who;
    m.innerHTML = html;
    body.appendChild(m);
    body.scrollTop = body.scrollHeight;
    return m;
  }

  function setChips(list) {
    chipsBox.innerHTML = '';
    (list || DEFAULT_CHIPS).forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chat__chip';
      b.textContent = c;
      b.addEventListener('click', function () { ask(c, CHIP_MAP[c]); });
      chipsBox.appendChild(b);
    });
  }

  function botReply(html, chips) {
    var typing = addMsg('<span class="chat__typing"><i></i><i></i><i></i></span>', 'bot');
    setTimeout(function () {
      typing.innerHTML = html;
      body.scrollTop = body.scrollHeight;
      setChips(chips);
    }, 550 + Math.min(html.length, 400));
  }

  function ask(text, forcedId) {
    addMsg(text.replace(/</g, '&lt;'), 'user');
    var entry = null;
    if (forcedId) KB.forEach(function (e) { if (e.id === forcedId) entry = e; });
    if (!entry) entry = findAnswer(text);
    if (entry) {
      botReply(entry.answer, entry.chips);
    } else {
      botReply("Je n'ai pas la réponse précise à cette question, mais notre équipe peut vous répondre directement :<br>" +
        waButton("Bonjour, j'ai une question sur la transition SEEG : " + text, 'Poser ma question sur WhatsApp'));
    }
  }

  function open() {
    chat.classList.add('is-open');
    fab.classList.add('is-chat-open');
    chat.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    if (!started) {
      started = true;
      botReply("Bonjour 👋 Je suis l'assistant du portail <strong>SEEG — Transition 2027</strong>. Posez-moi vos questions sur la réforme, les coupures ou la plateforme proposée.");
    }
    setTimeout(function () { input.focus(); }, 300);
  }
  function close() {
    chat.classList.remove('is-open');
    fab.classList.remove('is-chat-open');
    chat.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function () { chat.classList.contains('is-open') ? close() : open(); });
  document.getElementById('chat-close').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && chat.classList.contains('is-open')) close(); });
  body.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-close]');
    if (a) close();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var q = input.value.trim();
    if (!q) return;
    input.value = '';
    ask(q);
  });

  // Invitation discrète après quelques secondes, une seule fois par visite
  setTimeout(function () {
    try { if (sessionStorage.getItem('seegChatHint')) return; sessionStorage.setItem('symChatHint', '1'); } catch (e) {}
    if (!chat.classList.contains('is-open')) fab.classList.add('is-hint');
    setTimeout(function () { fab.classList.remove('is-hint'); }, 6000);
  }, 5000);
})();
