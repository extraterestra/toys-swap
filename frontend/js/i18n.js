const LANG_KEY = 'ts_lang';
const I18N = {
  pl: {
    meta: {
      title: 'ToySwap 🧸 — Wymiana zabawek i książek',
      footer: 'Wersja demo — tylko pod opieką rodziców. Brak otwartego czatu między dziećmi.'
    },
    lang: { label: 'Język', pl: 'PL', en: 'ENG' },
    nav: {
      home: 'Strona główna',
      login: 'Logowanie rodzica',
      register: 'Zarejestruj rodzinę',
      dashboard: 'Moja rodzina',
      listings: 'Moje ogłoszenia',
      browse: 'W okolicy',
      exchanges: 'Moje wymiany',
      admin: 'Admin',
      logout: 'Wyloguj',
      openMenu: 'Otwórz menu',
      closeMenu: 'Zamknij menu'
    },
    home: {
      heroTitle: 'Wymieniaj zabawki, z których dzieci już wyrosły, z rodzinami w okolicy',
      heroLede: 'Znajdź zabawki i książki odpowiednie do wieku, zaproponuj wymianę i niech każdy krok nadzorują rodzice.',
      ctaFind: 'Znajdź wymiany w okolicy',
      ctaSafe: 'Zobacz, jak ToySwap dba o bezpieczeństwo rodzin',
      howTitle: 'Jak działa wymiana',
      step1Title: '1. Konto zakłada rodzic',
      step1Body: 'Dzieci nigdy nie rejestrują się same. Dodajesz ich profile w ramach rodziny.',
      step2Title: '2. Wystaw to, z czego wyrosły',
      step2Body: 'Zrób zdjęcie zabawki lub książki. AI oceni stan i napisze przyjazny opis.',
      step3Title: '3. Przeglądaj okolice',
      step3Body: 'Widzisz oferty w promieniu sąsiedztwa — nie całego miasta i nigdy dokładnego adresu.',
      step4Title: '4. Propozycja, potem zgoda obu rodziców',
      step4Body: 'Nic nie jest umawiane, dopóki obie rodziny nie powiedzą tak. Potem przekazujemy wymianę do dostawy.',
      whereTitle: 'Gdzie działa ToySwap',
      whereBody: 'Wymiany są celowo lokalne. Rodziny widzą ogłoszenia tylko w promieniu ustawionym przez administratora — <strong>domyślnie 10 km</strong>.',
      whereMuted: 'Inne rodziny widzą okolicę lub kod pocztowy i odległość, nigdy ulicy. Kurier dostaje adresy odbioru i dostawy dopiero po zgodzie obu rodziców.',
      costTitle: 'Ile to kosztuje',
      costBody: 'Wystawianie, przeglądanie i dopasowanie są <strong>darmowe</strong>. Rodzice płacą <strong>tylko opłatę za dostawę</strong>, gdy wymiana zostanie zatwierdzona i przekazana kurierowi.',
      costMuted: 'Nie ma opłaty za dołączenie ani za odrzuconą propozycję.',
      safetyTitle: 'Jak ToySwap dba o bezpieczeństwo rodzin',
      safety1: 'Konta tylko dla rodziców. Profil dziecka nie istnieje bez rodzica.',
      safety2: 'Każda wymiana wymaga wyraźnej zgody <strong>obu</strong> rodziców, zanim zamówimy dostawę.',
      safety3: 'Brak otwartego czatu między dziećmi — tylko zestaw zatwierdzonych wiadomości, widoczny dla obu rodzin.',
      safety4: 'Tylko przybliżona lokalizacja. Rodziny nigdy nie widzą dokładnego adresu drugiej strony.',
      safety5: 'Zdjęcia służą ogłoszeniu. Ocena stanu pomaga wiedzieć, co się wymienia.',
      duringTitle: 'Co się dzieje podczas wymiany',
      during1: 'Dziecko (z rodzicem) oferuje jedną ze swoich rzeczy za ogłoszenie innej rodziny.',
      during2: 'Oboje rodzice oglądają ogłoszenia i zatwierdzają albo odrzucają.',
      during3: 'Jeśli oboje zatwierdzą, ToySwap zamawia dostawę. Rodzice płacą tylko tę opłatę.',
      during4: 'Kurier odbiera i dowozi. Rodziny zostają w domu — bez spotkań.',
      alreadyAccount: 'Mam już konto rodziny'
    },
    auth: {
      back: '← Wróć do ToySwap',
      registerTitle: 'Zarejestruj rodzinę',
      registerHint: 'Jedno konto na rodzica. Profile dzieci dodasz po rejestracji.',
      name: 'Twoje imię',
      email: 'E-mail',
      password: 'Hasło',
      address: 'Osiedle / kod pocztowy (wystarczy przybliżenie)',
      createAccount: 'Utwórz konto',
      loginTitle: 'Logowanie rodzica',
      logIn: 'Zaloguj się',
      noAccount: 'Nie masz konta?',
      registerLink: 'Zarejestruj rodzinę'
    },
    dash: {
      welcome: 'Witaj, {name} 👋',
      childrenHint: 'Profile dzieci. Dodaj jedno, żeby zacząć.',
      noChildren: 'Brak dodanych dzieci.',
      yourListings: 'Twoje ogłoszenia',
      addListing: '+ Dodaj ogłoszenie',
      listingsHint: 'Otwórz zabawkę, by zobaczyć szczegóły, historię wymian, zdjęcia oraz edytować lub usunąć.',
      addChild: 'Dodaj profil dziecka',
      childName: 'Imię / zdrobnienie dziecka',
      birthYear: 'Rok urodzenia (opcjonalnie)',
      avatarNeutral: '🧒 Neutralna',
      avatarBoy: '👦 Chłopiec',
      avatarGirl: '👧 Dziewczynka',
      avatarHero: '🦸 Superbohater',
      addChildBtn: 'Dodaj dziecko',
      there: 'tam'
    },
    listings: {
      addChildFirst: 'Najpierw dodaj profil dziecka w <a href="#" onclick="go(\'dashboard\')">{family}</a>.',
      tapHint: 'Dotknij ogłoszenia, by otworzyć szczegóły. Nowe dodasz formularzem poniżej.',
      addToy: 'Dodaj zabawkę lub książkę',
      addHint: 'Wybierz zdjęcie z galerii. AI oceni stan i napisze przyjazny opis.',
      listingAs: 'Wystawiasz jako:',
      toy: 'Zabawka',
      book: 'Książka',
      titlePh: 'Tytuł (np. Zamek Lego)',
      descPh: 'Coś jeszcze? (opcjonalnie)',
      photoGallery: 'Zdjęcie z galerii',
      analyze: 'Oceń i wystaw',
      analyzing: 'Analizujemy zdjęcie z AI... 🔎',
      listed: 'Wystawiono! 🎉',
      none: 'Brak zabawek i książek. Użyj „Dodaj ogłoszenie”, żeby utworzyć pierwsze.',
      listedOn: 'Wystawiono {date}',
      openDetails: 'Otwórz szczegóły',
      delete: 'Usuń',
      deleteConfirm: 'Usunąć to ogłoszenie? Tej operacji nie można cofnąć.',
      pending: 'Oczekuje',
      available: 'dostępne'
    },
    detail: {
      back: '← Wróć do ogłoszeń',
      listedMeta: 'Wystawiono {date} · {owner} · {category} · {status}',
      photos: 'Zdjęcia',
      noPhotos: 'Brak zdjęć.',
      addPhotos: 'Dodaj zdjęcia z galerii',
      addPhotosBtn: 'Dodaj zdjęcia',
      choosePhoto: 'Wybierz przynajmniej jedno zdjęcie',
      uploading: 'Wysyłanie...',
      edit: 'Edytuj ogłoszenie',
      title: 'Tytuł',
      description: 'Opis',
      save: 'Zapisz opis',
      saving: 'Zapisywanie...',
      saved: 'Zapisano!',
      swapHistory: 'Historia wymian',
      noSwaps: 'Brak historii wymian.',
      deleteListing: 'Usuń ogłoszenie',
      removePhoto: 'Usuń',
      removePhotoConfirm: 'Usunąć to zdjęcie?'
    },
    browse: {
      title: 'Zabawki i książki w okolicy',
      browsingAs: 'Przeglądasz jako:',
      within: 'Pokazujemy rzeczy w promieniu {km} km (ustawia administrator).',
      none: 'Na razie nic w okolicy — zajrzyj wkrótce!',
      by: 'Od {avatar} {name}',
      away: '📍 {km} km stąd',
      propose: 'Zaproponuj wymianę',
      needOwn: 'Najpierw wystaw własną zabawkę lub książkę, żeby mieć co zaoferować!',
      whichOffer: 'Którą swoją rzecz chcesz zaoferować?\n{list}\n\nPodaj numer:',
      proposed: 'Propozycja wysłana! Oboje rodzice muszą ją zatwierdzić w „Moje wymiany”.'
    },
    exchanges: {
      title: 'Moje wymiany',
      none: 'Brak propozycji wymiany.',
      status: 'Status',
      approve: 'Zatwierdź',
      decline: 'Odrzuć',
      openChat: 'Otwórz czat',
      bothApproved: 'Oboje rodzice zatwierdzili! Zamówienie poszło do aplikacji dostawy. Rodzice płacą tylko opłatę za dostawę.',
      chatTitle: 'Czat (tylko zatwierdzone wiadomości)',
      back: '← Wstecz',
      noMessages: 'Brak wiadomości.',
      sendAs: 'Wyślij jako:',
      forever: 'na zawsze'
    },
    status: {
      pending_parent_approval: 'Czeka na zgodę rodziców',
      approved: 'Zatwierdzona',
      delivery_requested: 'Wysłana do dostawy',
      declined: 'Odrzucona',
      pending_exchange: 'w trakcie wymiany',
      available: 'dostępne',
      unknown: 'Nieznany'
    },
    admin: {
      required: 'Wymagany dostęp administratora.',
      settings: 'Ustawienia administratora',
      settingsHint: 'Tylko konta z rolą admin widzą rodziny, ogłoszenia i wymiany.',
      radius: 'Promień widoczności wymian (km)',
      updateRadius: 'Zapisz promień',
      stats: 'Statystyki platformy',
      parents: 'Rodzice',
      children: 'Dzieci',
      items: 'Wystawione rzeczy',
      exchanges: 'Prośby o wymianę',
      delivered: 'Wymiany przekazane do dostawy',
      families: 'Rodziny',
      search: 'Szukaj po imieniu lub e-mailu',
      noMatch: 'Brak rodzin pasujących do wyszukiwania.',
      childrenN: '{n} dzieci',
      listingsN: '{n} ogłoszeń',
      exchangesN: '{n} wymian',
      allFamilies: '← Wszystkie rodziny',
      joined: 'dołączył(a) {date}',
      location: 'Lokalizacja: {addr}',
      childProfile: 'Profil dziecka',
      born: 'ur. {year}',
      added: 'dodano {date}',
      listings: 'Ogłoszenia ({n})',
      noListings: 'Brak wystawionych zabawek i książek.',
      exchangesTitle: 'Wymiany ({n})',
      noExchanges: 'Brak wymian.',
      listed: 'wystawiono {date}',
      updated: 'Zaktualizowano!',
      noChildProfiles: 'Ta rodzina nie ma jeszcze profili dzieci.'
    },
    common: {
      unknownDate: 'Nieznana data',
      pending: 'Oczekuje',
      requestFailed: 'Żądanie nie powiodło się ({status})'
    },
    condition: {
      likeNew: 'Jak nowa',
      good: 'Dobra',
      fair: 'Średnia',
      worn: 'Zużyta',
      notExchangeable: 'Nie do wymiany'
    },
    canned: {
      'Hi! 👋': 'Cześć! 👋',
      'Is this still available?': 'Czy to jeszcze dostępne?',
      'I would love to exchange with you!': 'Chętnie się wymienię!',
      "Great, let's ask our parents to confirm 🎉": 'Świetnie, poprośmy rodziców o potwierdzenie 🎉',
      'Can you tell me more about it?': 'Możesz powiedzieć coś więcej?',
      'Yes, it still works great!': 'Tak, nadal świetnie działa!',
      'It has a small scratch but works fine.': 'Ma małą rysę, ale działa dobrze.',
      'Thank you! 😊': 'Dziękuję! 😊',
      'See you soon!': 'Do zobaczenia wkrótce!',
      'My parent will arrange delivery.': 'Mój rodzic umówi dostawę.'
    },
    errors: {
      invalidLogin: 'Nieprawidłowy e-mail lub hasło',
      emailTaken: 'Ten e-mail jest już zarejestrowany',
      requiredFields: 'Imię, e-mail i hasło są wymagane',
      missingToken: 'Brak tokenu logowania',
      invalidToken: 'Nieprawidłowy lub wygasły token',
      accountNotFound: 'Nie znaleziono konta. Zaloguj się ponownie.',
      adminRequired: 'Wymagany dostęp administratora',
      listingNotFound: 'Nie znaleziono ogłoszenia',
      photoNotFound: 'Nie znaleziono zdjęcia',
      choosePhoto: 'Wybierz przynajmniej jedno zdjęcie',
      maxPhotos: 'Możesz dodać maksymalnie 8 zdjęć do ogłoszenia',
      activeExchange: 'To ogłoszenie jest w aktywnej wymianie. Najpierw odrzuć lub dokończ wymianę.',
      titleRequired: 'Tytuł jest wymagany',
      familyNotFound: 'Nie znaleziono rodziny',
      childNotYours: 'To dziecko nie należy do Twojego konta',
      childAndTitle: 'Wymagane są dziecko i tytuł',
      itemNotFound: 'Nie znaleziono przedmiotu',
      exchangeNotFound: 'Nie znaleziono wymiany',
      notParty: 'Nie jesteś stroną tej wymiany',
      displayNameRequired: 'Imię dziecka jest wymagane',
      radiusInvalid: 'Promień musi być liczbą dodatnią (maks. 500)',
      serverError: 'Błąd serwera'
    }
  },
  en: {
    meta: {
      title: 'ToySwap 🧸 — Swap Toys & Books',
      footer: 'MVP demo — parent-supervised only. No open chat between children.'
    },
    lang: { label: 'Language', pl: 'PL', en: 'ENG' },
    nav: {
      home: 'Home',
      login: 'Parent Login',
      register: 'Register Family',
      dashboard: 'My Family',
      listings: 'My listings',
      browse: 'Browse Nearby',
      exchanges: 'My Exchanges',
      admin: 'Admin',
      logout: 'Log out',
      openMenu: 'Open menu',
      closeMenu: 'Close menu'
    },
    home: {
      heroTitle: 'Swap toys your children have outgrown with families nearby',
      heroLede: 'Find age-appropriate toys and books, propose an exchange, and keep every step supervised by parents.',
      ctaFind: 'Find swaps near me',
      ctaSafe: 'See how ToySwap keeps families safe',
      howTitle: 'How a swap works',
      step1Title: '1. A parent creates the account',
      step1Body: 'Children never register alone. You add their profiles under your family.',
      step2Title: '2. List what they’ve outgrown',
      step2Body: 'Photograph a toy or book. AI checks condition and writes a friendly listing.',
      step3Title: '3. Browse nearby',
      step3Body: 'See what’s available within your neighborhood radius — not the whole city, and never an exact address.',
      step4Title: '4. Propose, then both parents approve',
      step4Body: 'Nothing is scheduled until both families say yes. Then we hand the exchange to delivery.',
      whereTitle: 'Where ToySwap works',
      whereBody: 'Swaps are local on purpose. Families only see listings inside an admin-set radius — <strong>10 km by default</strong>.',
      whereMuted: 'Other families see a neighborhood or postal area and distance, never your street address. The courier is the only party who gets pickup and drop-off details after both parents approve.',
      costTitle: 'What it costs',
      costBody: 'Listing, browsing, and matching are <strong>free</strong>. Parents pay <strong>only the delivery fee</strong> when a swap is approved and sent to the courier.',
      costMuted: 'There is no fee to join, and no charge if a proposal is declined.',
      safetyTitle: 'How ToySwap keeps families safe',
      safety1: 'Parent-only accounts. A child profile cannot exist without a parent.',
      safety2: 'Every exchange needs explicit approval from <strong>both</strong> parents before delivery is requested.',
      safety3: 'No open chat between children — only a short list of pre-approved messages, visible to both families.',
      safety4: 'Approximate location only. Families never see each other’s exact address.',
      safety5: 'Photos are for the listing. Condition is scored so families know what they are swapping.',
      duringTitle: 'What happens during a swap',
      during1: 'A child (with a parent) offers one of their listed items for another family’s item.',
      during2: 'Both parents review the listings and approve or decline.',
      during3: 'If both approve, ToySwap requests a delivery. Parents are charged only that delivery fee.',
      during4: 'The courier collects and drops off. Families stay at home — no meetups required.',
      alreadyAccount: 'I already have a family account'
    },
    auth: {
      back: '← Back to ToySwap',
      registerTitle: 'Register Your Family',
      registerHint: 'One account per parent. You’ll add your children’s profiles after registering.',
      name: 'Your name',
      email: 'Email',
      password: 'Password',
      address: 'Neighborhood / postal code (approximate is fine)',
      createAccount: 'Create Account',
      loginTitle: 'Parent Login',
      logIn: 'Log In',
      noAccount: 'No account yet?',
      registerLink: 'Register your family'
    },
    dash: {
      welcome: 'Welcome, {name} 👋',
      childrenHint: 'Your children’s profiles. Add one to get started.',
      noChildren: 'No children added yet.',
      yourListings: 'Your listings',
      addListing: '+ Add listing',
      listingsHint: 'Open a toy to see details, swap history, photos, and edit or delete it.',
      addChild: 'Add a Child Profile',
      childName: 'Child’s first name / nickname',
      birthYear: 'Birth year (optional)',
      avatarNeutral: '🧒 Neutral',
      avatarBoy: '👦 Boy',
      avatarGirl: '👧 Girl',
      avatarHero: '🦸 Superhero',
      addChildBtn: 'Add Child',
      there: 'there'
    },
    listings: {
      addChildFirst: 'Add a child profile first from <a href="#" onclick="go(\'dashboard\')">{family}</a>.',
      tapHint: 'Tap a listing to open its details. Add a new one with the form under the list.',
      addToy: 'Add a toy or book',
      addHint: 'Pick a photo from your gallery. Our AI will check its condition and write a friendly description.',
      listingAs: 'Listing as:',
      toy: 'Toy',
      book: 'Book',
      titlePh: 'Title (e.g. Lego Castle)',
      descPh: 'Anything else to add? (optional)',
      photoGallery: 'Photo from gallery',
      analyze: 'Analyze & List',
      analyzing: 'Analyzing photo with AI... 🔎',
      listed: 'Listed! 🎉',
      none: 'No toys or books listed yet. Use Add listing below to create one.',
      listedOn: 'Listed {date}',
      openDetails: 'Open details',
      delete: 'Delete',
      deleteConfirm: 'Delete this listing? This cannot be undone.',
      pending: 'Pending',
      available: 'available'
    },
    detail: {
      back: '← Back to listings',
      listedMeta: 'Listed {date} · {owner} · {category} · {status}',
      photos: 'Photos',
      noPhotos: 'No photos yet.',
      addPhotos: 'Add photos from gallery',
      addPhotosBtn: 'Add photos',
      choosePhoto: 'Choose at least one photo',
      uploading: 'Uploading...',
      edit: 'Edit listing',
      title: 'Title',
      description: 'Description',
      save: 'Save description',
      saving: 'Saving...',
      saved: 'Saved!',
      swapHistory: 'Swap history',
      noSwaps: 'No swap history yet.',
      deleteListing: 'Delete listing',
      removePhoto: 'Remove',
      removePhotoConfirm: 'Remove this photo?'
    },
    browse: {
      title: 'Browse Nearby Toys & Books',
      browsingAs: 'Browsing as:',
      within: 'Showing items within {km} km (set by admin).',
      none: 'No items nearby yet — check back soon!',
      by: 'By {avatar} {name}',
      away: '📍 {km} km away',
      propose: 'Propose Exchange',
      needOwn: 'List one of your own toys/books first so you have something to offer!',
      whichOffer: 'Which of your items to offer?\n{list}\n\nEnter number:',
      proposed: 'Exchange proposed! Both parents need to approve it under “My Exchanges”.'
    },
    exchanges: {
      title: 'My Exchanges',
      none: 'No exchange requests yet.',
      status: 'Status',
      approve: 'Approve',
      decline: 'Decline',
      openChat: 'Open Chat',
      bothApproved: 'Both parents approved! A delivery order has been sent to the delivery app. Parents will be charged only the delivery fee.',
      chatTitle: 'Chat (safe, pre-approved messages only)',
      back: '← Back',
      noMessages: 'No messages yet.',
      sendAs: 'Send as:',
      forever: 'forever'
    },
    status: {
      pending_parent_approval: 'Waiting for parent approval',
      approved: 'Approved',
      delivery_requested: 'Sent to delivery',
      declined: 'Declined',
      pending_exchange: 'pending exchange',
      available: 'available',
      unknown: 'Unknown'
    },
    admin: {
      required: 'Admin access required.',
      settings: 'Admin Settings',
      settingsHint: 'Only accounts with the admin role can view families, listings, and exchanges.',
      radius: 'Exchange visibility radius (km)',
      updateRadius: 'Update Radius',
      stats: 'Platform Stats',
      parents: 'Parents',
      children: 'Children',
      items: 'Items listed',
      exchanges: 'Exchange requests',
      delivered: 'Exchanges sent to delivery',
      families: 'Families',
      search: 'Search by name or email',
      noMatch: 'No families match that search.',
      childrenN: '{n} children',
      listingsN: '{n} listings',
      exchangesN: '{n} exchanges',
      allFamilies: '← All families',
      joined: 'joined {date}',
      location: 'Location: {addr}',
      childProfile: 'Child profile',
      born: 'born {year}',
      added: 'added {date}',
      listings: 'Listings ({n})',
      noListings: 'No toys or books listed.',
      exchangesTitle: 'Exchanges ({n})',
      noExchanges: 'No exchanges yet.',
      listed: 'listed {date}',
      updated: 'Updated!',
      noChildProfiles: 'This family has no child profiles yet.'
    },
    common: {
      unknownDate: 'Unknown date',
      pending: 'Pending',
      requestFailed: 'Request failed ({status})'
    },
    condition: {
      likeNew: 'Like new',
      good: 'Good',
      fair: 'Fair',
      worn: 'Worn',
      notExchangeable: 'Not exchangeable'
    },
    canned: {},
    errors: {
      invalidLogin: 'Invalid email or password',
      emailTaken: 'Email already registered',
      requiredFields: 'name, email and password are required',
      missingToken: 'Missing auth token',
      invalidToken: 'Invalid or expired token',
      accountNotFound: 'Account not found. Please log in again.',
      adminRequired: 'Admin access required',
      listingNotFound: 'Listing not found',
      photoNotFound: 'Photo not found',
      choosePhoto: 'Choose at least one photo',
      maxPhotos: 'You can attach up to 8 photos per listing',
      activeExchange: 'This listing is in an active exchange. Decline or finish the exchange first.',
      titleRequired: 'title is required',
      familyNotFound: 'Family not found',
      childNotYours: 'This child does not belong to your account',
      childAndTitle: 'child_id and title are required',
      itemNotFound: 'Item not found',
      exchangeNotFound: 'Exchange not found',
      notParty: 'You are not a party to this exchange',
      displayNameRequired: 'display_name is required',
      radiusInvalid: 'radius_km must be a positive number (max 500)',
      serverError: 'Internal server error'
    }
  }
};

const API_ERROR_KEYS = {
  'Invalid email or password': 'errors.invalidLogin',
  'Email already registered': 'errors.emailTaken',
  'name, email and password are required': 'errors.requiredFields',
  'Missing auth token': 'errors.missingToken',
  'Invalid or expired token': 'errors.invalidToken',
  'Account not found. Please log in again.': 'errors.accountNotFound',
  'Admin access required': 'errors.adminRequired',
  'Listing not found': 'errors.listingNotFound',
  'Photo not found': 'errors.photoNotFound',
  'Choose at least one photo': 'errors.choosePhoto',
  'You can attach up to 8 photos per listing': 'errors.maxPhotos',
  'This listing is in an active exchange. Decline or finish the exchange first.': 'errors.activeExchange',
  'title is required': 'errors.titleRequired',
  'Family not found': 'errors.familyNotFound',
  'This child does not belong to your account': 'errors.childNotYours',
  'child_id and title are required': 'errors.childAndTitle',
  'Item not found': 'errors.itemNotFound',
  'Exchange not found': 'errors.exchangeNotFound',
  'You are not a party to this exchange': 'errors.notParty',
  'display_name is required': 'errors.displayNameRequired',
  'radius_km must be a positive number (max 500)': 'errors.radiusInvalid',
  'Internal server error': 'errors.serverError'
};

function tCanned(text) {
  if (getLang() === 'en') return text;
  return I18N.pl.canned[text] || text;
}

function getLang() {
  const stored = localStorage.getItem(LANG_KEY);
  return stored === 'en' || stored === 'pl' ? stored : 'pl';
}

function t(key, vars) {
  const pick = (lang) => key.split('.').reduce((obj, part) => (obj && obj[part] !== undefined ? obj[part] : undefined), I18N[lang]);
  let text = pick(getLang());
  if (text === undefined) text = pick('pl');
  if (typeof text !== 'string') text = key;
  if (vars) {
    Object.keys(vars).forEach((name) => {
      text = text.replaceAll(`{${name}}`, String(vars[name] ?? ''));
    });
  }
  return text;
}

function tError(message) {
  const key = API_ERROR_KEYS[message];
  return key ? t(key) : message;
}

function applyChrome() {
  document.documentElement.lang = getLang() === 'en' ? 'en' : 'pl';
  document.title = t('meta.title');
  const footer = document.querySelector('.footer');
  if (footer) footer.textContent = t('meta.footer');
}

function languageNavHtml() {
  const lang = getLang();
  return `<div class="lang-switch lang-switch-nav" role="group" aria-label="${t('lang.label')}">
    <button type="button" class="${lang === 'pl' ? 'active' : ''}" onclick="setLang('pl')">PL</button>
    <button type="button" class="${lang === 'en' ? 'active' : ''}" onclick="setLang('en')">ENG</button>
  </div>`;
}

function languagePickerHtml() {
  const lang = getLang();
  return `
    <div class="lang-picker">
      <span class="lang-label">${t('lang.label')}</span>
      <div class="lang-switch" role="group" aria-label="${t('lang.label')}">
        <button type="button" class="${lang === 'pl' ? 'active' : ''}" onclick="setLang('pl')">PL</button>
        <button type="button" class="${lang === 'en' ? 'active' : ''}" onclick="setLang('en')">ENG</button>
      </div>
    </div>
  `;
}

function setLang(code) {
  localStorage.setItem(LANG_KEY, code === 'en' ? 'en' : 'pl');
  applyChrome();
  const hash = (location.hash || '').replace(/^#/, '');
  const [route, id] = hash.split('/');
  if (route) go(route, id ? (route === 'home' ? { section: id } : { id }) : {});
  else go(getToken() ? 'dashboard' : 'home');
}

applyChrome();
