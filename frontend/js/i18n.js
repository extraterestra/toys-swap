const LANG_KEY = 'ts_lang';
const I18N = {
  pl: {
    meta: {
      title: 'ToySwap 🧸 — Wymiana zabawek i książek',
      footer: 'Zamknięty pilotaż rodzinny — konta tylko dla rodziców. Brak otwartego czatu między dziećmi.'
    },
    lang: { label: 'Język', pl: 'PL', en: 'ENG' },
    nav: {
      home: 'Strona główna',
      login: 'Logowanie rodzica',
      register: 'Zarejestruj rodzinę',
      costs: 'Koszty i dostawa',
      privacy: 'Prywatność',
      terms: 'Regulamin',
      safety: 'Bezpieczeństwo',
      rules: 'Zasady',
      dashboard: 'Moja rodzina',
      listings: 'Moje ogłoszenia',
      browse: 'W okolicy',
      exchanges: 'Moje wymiany',
      admin: 'Admin',
      logout: 'Wyloguj',
      openMenu: 'Otwórz menu',
      closeMenu: 'Zamknij menu'
    },
    phase: {
      now: 'Dostępne teraz',
      pilot: 'Tylko pilotaż',
      planned: 'Planowane'
    },
    home: {
      heroTitle: 'Wymieniaj zabawki, z których dzieci już wyrosły, z rodzinami w okolicy',
      heroLede: 'To zamknięty pilotaż dla zaproszonych rodzin. Rodzic zakłada konto, dzieci mają profile, a każdą wymianę zatwierdzają obie strony.',
      heroAlt: 'Zabawki zbierają się przy świecącej skrzyni ze skarbami',
      heroCredit: 'Ilustracja na potrzeby pilotażu. Prawa do użytku publicznego: patrz rejestr zasobów (jeszcze niepotwierdzone).',
      ctaFind: 'Dołącz do pilotażu',
      ctaSafe: 'Bezpieczeństwo i koszty',
      ctaCosts: 'Zobacz koszty i dostawę',
      howTitle: 'Jak działa wymiana',
      step1Title: '1. Konto zakłada rodzic',
      step1Body: 'Dzieci nigdy nie rejestrują się same. Dodajesz ich profile w ramach rodziny.',
      step2Title: '2. Wystaw to, z czego wyrosły',
      step2Body: 'Zrób zdjęcie zabawki lub książki. W pilotażu dodajemy szacunkową ocenę stanu — to podpowiedź, nie ekspertyza.',
      step3Title: '3. Przeglądaj okolice',
      step3Body: 'Widzisz ogłoszenia w promieniu ustawionym przez operatora (domyślnie ok. 10 km). Inne rodziny widzą odległość i okolicę, nie ulicy.',
      step4Title: '4. Propozycja, potem zgoda obu rodziców',
      step4Body: 'Nic nie jest umawiane, dopóki obie rodziny nie powiedzą tak. Dopiero wtedy próbujemy zgłosić wymianę do partnera dostaw w obszarze pilotażu.',
      safetyTitle: 'Jak ToySwap dba o bezpieczeństwo rodzin',
      safety1: 'Konta tylko dla rodziców. Profil dziecka nie istnieje bez rodzica.',
      safety2: 'Każda wymiana wymaga wyraźnej zgody <strong>obu</strong> rodziców, zanim cokolwiek wyślemy do partnera dostaw.',
      safety3: 'Brak otwartego czatu między dziećmi — tylko zestaw zatwierdzonych wiadomości, widoczny dla obu rodzin.',
      safety4: 'Tylko przybliżona lokalizacja. Rodziny nigdy nie widzą dokładnego adresu drugiej strony w aplikacji.',
      safety5: 'Zdjęcia służą ogłoszeniu. Ocena stanu w pilotażu jest szacunkiem, nie gwarancją jakości.',
      safety6: 'Inne rodziny widzą ksywkę i przedział wieku, nie nazwisko, szkołę, adres ani dokładną lokalizację.',
      duringTitle: 'Co się dzieje podczas wymiany',
      during1: 'Dziecko (z rodzicem) oferuje jedną ze swoich rzeczy za ogłoszenie innej rodziny.',
      during2: 'Oboje rodzice oglądają ogłoszenia i zatwierdzają albo odrzucają.',
      during3: 'Jeśli oboje zatwierdzą, aplikacja może powiadomić partnera dostaw. W pilotażu <strong>nie pobieramy opłaty w aplikacji</strong> (0 zł).',
      during4: 'Aplikacja nie wymaga spotkania rodzin. Odbioru kurierem nie gwarantujemy — działa tylko tam, gdzie partner testowo odbiera (obecnie okolice Rabki-Zdroju). Jeśli dostawa się nie uda, umawiacie przekazanie z pomocą operatora.',
      alreadyAccount: 'Mam już konto rodziny',
      promo: 'Zamknięty pilotaż rodzinny — nie jesteśmy jeszcze publicznym marketplace’em',
      footerReady: 'Chcecie dołączyć do pilotażu?',
      value1Title: 'Bezpiecznie',
      value1Body: 'Konta tylko dla rodziców. Obie rodziny zatwierdzają wymianę.',
      value2Title: 'Lokalnie',
      value2Body: 'Ogłoszenia w ustawionym promieniu (domyślnie ok. 10 km). Nigdy dokładnego adresu w aplikacji.',
      value3Title: 'Bez opłat w aplikacji',
      value3Body: 'Konto, ogłoszenia i dopasowanie: 0 zł. Dostawa w pilotażu też nie jest rozliczana w ToySwap.'
    },
    costs: {
      title: 'Koszty i dostawa',
      intro: 'Zanim założysz konto albo zatwierdzisz wymianę: poniżej jest to, co działa teraz, co jest tylko w pilotażu, a co dopiero planujemy.',
      joinTitle: 'Konto i ogłoszenia',
      joinBody: 'Rejestracja, wystawianie zabawek i książek, przeglądanie okolicy i odrzucenie propozycji są bezpłatne. ToySwap nie pobiera prowizji od wymiany.',
      deliveryTitle: 'Dostawa w pilotażu',
      deliveryBody: 'Po zgodzie obu rodziców aplikacja może wysłać zgłoszenie do testowego partnera dostaw (obszar testowy: okolice Rabki-Zdroju / południowa Polska). To nie jest sieć kurierska w całym kraju. Nie ma cennika w aplikacji — <strong>0 zł w ToySwap</strong>. Partner nie ma jeszcze opublikowanej taryfy.',
      failTitle: 'Gdy dostawa się nie uda',
      failBody: 'Status „wysłana do dostawy” nie oznacza, że kurier jedzie. Jeśli zgłoszenie do partnera zawiedzie, operator kontaktuje się z rodzinami. Możliwe jest przekazanie przedmiotów poza kurierem.',
      cancelTitle: 'Anulowanie',
      cancelBody: 'Propozycję można odrzucić bez opłaty. Po podwójnej zgodzie dajcie znać operatorowi — nie ma automatycznego odwołania kuriera, bo rezerwacja nie jest gwarantowana.',
      damageTitle: 'Szkoda, zguba, zwrot pieniędzy',
      damageBody: 'Nie sprzedajemy ubezpieczenia i nie obsługujemy zwrotów w aplikacji (nie ma płatności w aplikacji). Zróbcie zdjęcia przy przekazaniu. Roszczenia wobec kuriera — dopiero po umowie z partnerem.',
      plannedTitle: 'Planowane (niedostępne)',
      plannedBody: 'Opłata za dostawę pobierana kartą, ogólnopolski kurier, gwarantowany odbiór z domu oraz automatyczne zwroty. Tego jeszcze nie ma — nie obiecujemy tego przy rejestracji.',
      back: '← Wróć'
    },
    privacy: {
      title: 'Prywatność i dane dzieci',
      version: 'Wersja polityki: {version}',
      intro: 'ToySwap jest zamkniętym pilotażem dla rodzin. Konta zakładają wyłącznie rodzice lub opiekunowie. Poniżej jest to, co zbieramy i czego nie pokazujemy innym rodzinom.',
      childTitle: 'Dane dziecka (minimum)',
      childBody: 'Profil dziecka to ksywka, przedział wieku i emoji. Nie zbieramy nazwiska, dokładnego roku urodzenia, szkoły, e-maila dziecka ani zdjęcia twarzy jako avatara.',
      parentTitle: 'Dane rodzica',
      parentBody: 'Imię, e-mail, hasło (zahashowane) i przybliżona okolica (osiedle / kod). Współrzędne GPS z telefonu nie są przyjmowane. Dokładny adres, jeśli podany, służy tylko dostawie po zgodzie obu rodziców — inne rodziny go nie widzą.',
      shareTitle: 'Czego inne rodziny nigdy nie dostają',
      share1: 'Dokładna lokalizacja, ulica, e-mail, nazwisko, szkoła',
      share2: 'Widzą ksywkę, emoji, ogłoszenie i przybliżoną odległość w kilometrach',
      share3: 'Czat dzieci to wyłącznie gotowe komunikaty, bez dowolnego tekstu',
      retainTitle: 'Jak długo trzymamy dane',
      retainBody: 'Konto i ogłoszenia — dopóki konto jest aktywne. Po usunięciu kasujemy bazę i pliki zdjęć od razu. Kopie zapasowe giną zgodnie z harmonogramem hosta (zwykle do 30 dni). Dowód zgody (wersja polityki, skrót e-maila, czas) możemy zatrzymać do 3 lat, jeśli prawo tego wymaga. Szczegóły: mapa danych w dokumentacji projektu.',
      deleteTitle: 'Usuwanie',
      deleteBody: 'W „Moja rodzina” możesz usunąć profil dziecka (ogłoszenia i zdjęcia) albo całe konto. Aktywnej wymiany nie usuniemy, dopóki jej nie odrzucisz lub nie dokończysz.',
      legalTitle: 'Przegląd prawny',
      legalBody: 'Ten opis nie zastępuje opinii prawnej. Przed szerszym pilotażem w UE dokument wymaga przeglądu pod GDPR i zasady ochrony danych dzieci w jurysdykcjach pilotażu.',
      back: '← Wróć'
    },
    auth: {
      back: '← Wróć do ToySwap',
      registerTitle: 'Zarejestruj rodzinę',
      registerHint: 'Jedno konto na rodzica. Profile dzieci dodasz po rejestracji.',
      registerNotice: 'Konto, ogłoszenia i dopasowanie: 0 zł. Dostawa w pilotażu nie jest płatna w aplikacji i nie jest gwarantowana poza obszarem testowym (okolice Rabki-Zdroju).',
      name: 'Twoje imię',
      email: 'E-mail',
      password: 'Hasło',
      address: 'Osiedle / kod pocztowy (wystarczy przybliżenie — bez ulicy i numeru)',
      locationHint: 'Potrzebujemy okolicy, żeby pokazać ogłoszenia w ustawionym promieniu (domyślnie ok. 10 km). Nie bierzemy GPS z telefonu. Inne rodziny widzą tylko zaokrąglone kilometry, nie Twoją ulicę.',
      consentLabel: 'Oświadczam, że przeczytałem/am dokumenty wymagane (Prywatność, Regulamin, Bezpieczeństwo rodziny, Zasady społeczności) podane powyżej, w wersji {version}. Pole jest wymagane i domyślnie odznaczone.',
      noMarketing: 'To nie jest zgoda marketingowa. ToySwap nie wysyła newsletterów ani ofert handlowych.',
      createAccount: 'Utwórz konto',
      loginTitle: 'Logowanie rodzica',
      logIn: 'Zaloguj się',
      noAccount: 'Nie masz konta?',
      registerLink: 'Zarejestruj rodzinę'
    },
    dash: {
      welcome: 'Witaj, {name} 👋',
      childrenHint: 'Profile dzieci: ksywka i przedział wieku. Nie wpisuj nazwiska, szkoły ani daty urodzenia.',
      noChildren: 'Brak dodanych dzieci.',
      yourListings: 'Twoje ogłoszenia',
      addListing: '+ Dodaj ogłoszenie',
      listingsHint: 'Otwórz zabawkę, by zobaczyć szczegóły, historię wymian, zdjęcia oraz edytować lub usunąć.',
      addChild: 'Dodaj profil dziecka',
      childName: 'Ksywka (nie nazwisko)',
      childNameHint: 'Tylko imię lub ksywka — to zobaczą inne rodziny.',
      ageRange: 'Przedział wieku',
      ageChoose: 'Wybierz przedział wieku',
      ageBand: {
        '0-2': '0–2 lata',
        '3-5': '3–5 lat',
        '6-8': '6–8 lat',
        '9-12': '9–12 lat',
        '13-17': '13–17 lat'
      },
      guardianLabel: 'Jestem rodzicem lub opiekunem prawnym tego dziecka i zgadzam się na utworzenie profilu zgodnie z polityką {version}. Nie podam nazwiska, szkoły, adresu ani dokładnej daty urodzenia.',
      avatarNeutral: '🧒 Neutralna',
      avatarBoy: '👦 Chłopiec',
      avatarGirl: '👧 Dziewczynka',
      avatarHero: '🦸 Superbohater',
      addChildBtn: 'Dodaj dziecko',
      deleteChild: 'Usuń profil',
      deleteChildConfirm: 'Usunąć profil {name}? Znikną też ogłoszenia i zdjęcia tego dziecka. Aktywnej wymiany nie da się usunąć.',
      familyData: 'Dane rodziny',
      deleteAccount: 'Usuń konto rodziny',
      deleteAccountConfirm: 'To trwale usunie konto, profile dzieci, ogłoszenia, zdjęcia i historię wymian, których jesteście stroną. Wpisz DELETE, aby potwierdzić.',
      deleteAccountPrompt: 'DELETE',
      there: 'tam'
    },
    listings: {
      addChildFirst: 'Najpierw dodaj profil dziecka w <a href="#" onclick="go(\'dashboard\')">{family}</a>.',
      tapHint: 'Dotknij ogłoszenia, by otworzyć szczegóły. Nowe dodasz formularzem poniżej.',
      addToy: 'Dodaj zabawkę lub książkę',
      addHint: 'Wybierz zdjęcie z galerii. W pilotażu dodamy szacunkową ocenę stanu — to podpowiedź, nie ekspertyza.',
      photoSafety: 'Zdjęcia idą do innych rodzin od razu. Nikt ich wcześniej nie przegląda (ani człowiek, ani filtr bezpieczeństwa). Fotografuj tylko przedmiot, bez twarzy dziecka. Zakazane rzeczy: strona Zasady.',
      analyzing: 'Przygotowujemy ocenę stanu... 🔎',
      listingAs: 'Wystawiasz jako:',
      toy: 'Zabawka',
      book: 'Książka',
      titlePh: 'Tytuł (np. Zamek Lego)',
      descPh: 'Opcjonalnie — bez adresu, szkoły i nazwiska dziecka',
      photoGallery: 'Zdjęcie z galerii',
      analyze: 'Oceń i wystaw',
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
      proposed: 'Propozycja wysłana! Oboje rodzice muszą ją zatwierdzić w „Moje wymiany”.',
      reportFamily: 'Zgłoś rodzinę'
    },
    exchanges: {
      title: 'Moje wymiany',
      none: 'Brak propozycji wymiany.',
      status: 'Status',
      approve: 'Zatwierdź',
      decline: 'Odrzuć',
      openChat: 'Otwórz czat',
      bothApproved: 'Oboje rodzice zatwierdzili. Jeśli partner dostaw przyjmie zgłoszenie, przekażemy dalej. W aplikacji nadal 0 zł — kurier nie jest gwarantowany.',
      approveConfirm: 'Zatwierdzenie może wysłać zgłoszenie do partnera dostaw (pilotaż, okolice Rabki-Zdroju). ToySwap nie pobiera opłaty (0 zł). Kurier nie jest gwarantowany. Kontynuować?',
      chatTitle: 'Czat (tylko zatwierdzone wiadomości)',
      back: '← Wstecz',
      noMessages: 'Brak wiadomości.',
      sendAs: 'Wyślij jako:',
      forever: 'na zawsze',
      report: 'Zgłoś wymianę',
      reportMessage: 'Zgłoś wiadomość'
    },
    status: {
      pending_parent_approval: 'Czeka na zgodę rodziców',
      approved: 'Zatwierdzona',
      delivery_requested: 'Wysłana do dostawy',
      declined: 'Odrzucona',
      removed: 'zdjęte',
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
      ageRange: 'wiek {band}',
      added: 'dodano {date}',
      listings: 'Ogłoszenia ({n})',
      noListings: 'Brak wystawionych zabawek i książek.',
      exchangesTitle: 'Wymiany ({n})',
      noExchanges: 'Brak wymian.',
      listed: 'wystawiono {date}',
      updated: 'Zaktualizowano!',
      noChildProfiles: 'Ta rodzina nie ma jeszcze profili dzieci.',
      reports: 'Zgłoszenia',
      noReports: 'Brak zgłoszeń.',
      resolve: 'Zamknij',
      dismiss: 'Odrzuć',
      removeListing: 'Zdejmij ogłoszenie'
    },
    report: {
      button: 'Zgłoś',
      title: 'Zgłoś do operatora',
      hint: 'Zgłoszenie trafia do operatora pilotażu. W nagłym zagrożeniu dzwoń 112.',
      reason: 'Powód',
      details: 'Szczegóły (opcjonalnie, bez danych dziecka)',
      submit: 'Wyślij zgłoszenie',
      cancel: 'Anuluj',
      sent: 'Zgłoszenie wysłane. Operator odpisze na e-mail konta.',
      block: 'Blokuj rodzinę',
      blocked: 'Rodzina zablokowana. Ich ogłoszenia znikną z okolicy.',
      unsafe_item: 'Niebezpieczny przedmiot',
      child_in_photo: 'Dziecko na zdjęciu',
      prohibited: 'Zakazane ogłoszenie',
      hygiene: 'Higiena / stan',
      harassment: 'Nękanie albo złamanie zasad czatu',
      other: 'Inne'
    },
    support: {
      label: 'Wsparcie',
      line: 'Kontakt: {contact}. Cel odpowiedzi: {hours} h w dni robocze. Nagły wypadek: {emergency}.',
      unconfigured: 'adres wsparcia nieustawiony (SUPPORT_EMAIL)'
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
      displayNameRequired: 'Ksywka jest wymagana',
      nicknameLong: 'Ksywka jest za długa (maks. 40 znaków)',
      nicknameInvalid: 'Użyj imienia lub ksywki — nie e-maila ani identyfikatora',
      ageRangeRequired: 'Wybierz przedział wieku',
      guardianRequired: 'Zanim utworzysz profil dziecka, potwierdź, że jesteś opiekunem',
      privacyConsentRequired: 'Aby założyć konto, musisz zaakceptować wymagane dokumenty',
      reportSubject: 'Zgłoszenie wymaga przedmiotu',
      reportReason: 'Wybierz powód zgłoszenia',
      reportOtherFamily: 'Możesz zgłosić tylko inną rodzinę',
      reportNotFound: 'Nie znaleziono zgłoszenia',
      childNotFound: 'Nie znaleziono profilu dziecka',
      childActiveExchange: 'To dziecko ma aktywną wymianę. Najpierw odrzuć lub dokończ wymianę.',
      familyActiveExchange: 'Profil dziecka ma aktywną wymianę. Odrzuć lub dokończ ją, zanim usuniesz konto rodziny.',
      radiusInvalid: 'Promień musi być liczbą dodatnią (maks. 500)',
      serverError: 'Błąd serwera'
    }
  },
  en: {
    meta: {
      title: 'ToySwap 🧸 — Swap Toys & Books',
      footer: 'Closed family pilot — parent accounts only. No open chat between children.'
    },
    lang: { label: 'Language', pl: 'PL', en: 'ENG' },
    nav: {
      home: 'Home',
      login: 'Parent Login',
      register: 'Register Family',
      costs: 'Costs & delivery',
      privacy: 'Privacy',
      terms: 'Terms',
      safety: 'Safety',
      rules: 'Rules',
      dashboard: 'My Family',
      listings: 'My listings',
      browse: 'Browse Nearby',
      exchanges: 'My Exchanges',
      admin: 'Admin',
      logout: 'Log out',
      openMenu: 'Open menu',
      closeMenu: 'Close menu'
    },
    phase: {
      now: 'Available now',
      pilot: 'Pilot only',
      planned: 'Planned'
    },
    home: {
      heroTitle: 'Swap toys your children have outgrown with families nearby',
      heroLede: 'This is a closed pilot for invited families. A parent creates the account, children have profiles, and both sides approve every swap.',
      heroAlt: 'Toys gathered around a glowing treasure chest',
      heroCredit: 'Illustration for the pilot. Public-use rights: see the asset register (not yet confirmed).',
      ctaFind: 'Join the pilot',
      ctaSafe: 'Safety and costs',
      ctaCosts: 'See costs and delivery',
      howTitle: 'How a swap works',
      step1Title: '1. A parent creates the account',
      step1Body: 'Children never register alone. You add their profiles under your family.',
      step2Title: '2. List what they’ve outgrown',
      step2Body: 'Photograph a toy or book. In the pilot we add an estimated condition score — a hint, not an appraisal.',
      step3Title: '3. Browse nearby',
      step3Body: 'You see listings inside the operator-set radius (about 10 km by default). Other families see distance and area, never your street.',
      step4Title: '4. Propose, then both parents approve',
      step4Body: 'Nothing is scheduled until both families say yes. Only then we may notify the delivery partner in the pilot area.',
      safetyTitle: 'How ToySwap keeps families safe',
      safety1: 'Parent-only accounts. A child profile cannot exist without a parent.',
      safety2: 'Every exchange needs explicit approval from <strong>both</strong> parents before we notify a delivery partner.',
      safety3: 'No open chat between children — only a short list of pre-approved messages, visible to both families.',
      safety4: 'Approximate location only. Families never see each other’s exact address in the app.',
      safety5: 'Photos are for the listing. The condition score in the pilot is an estimate, not a quality guarantee.',
      safety6: 'Other families see a nickname and age range — not a surname, school, address, or exact location.',
      duringTitle: 'What happens during a swap',
      during1: 'A child (with a parent) offers one of their listed items for another family’s item.',
      during2: 'Both parents review the listings and approve or decline.',
      during3: 'If both approve, the app may notify the delivery partner. During the pilot we <strong>charge 0 PLN in the app</strong>.',
      during4: 'The app does not require families to meet. Courier collection is not guaranteed — only where the partner is testing (currently around Rabka-Zdrój). If delivery cannot be booked, you arrange handover with the operator.',
      alreadyAccount: 'I already have a family account',
      promo: 'Closed family pilot — not a public marketplace yet',
      footerReady: 'Want to join the pilot?',
      value1Title: 'Safe',
      value1Body: 'Parent-only accounts. Both families approve the swap.',
      value2Title: 'Local',
      value2Body: 'Listings inside a set radius (about 10 km by default). Never an exact street address in the app.',
      value3Title: 'No in-app fees',
      value3Body: 'Account, listings, and matching: 0 PLN. Delivery is not billed inside ToySwap during the pilot.'
    },
    costs: {
      title: 'Costs and delivery',
      intro: 'Before you register or approve a swap: here is what works now, what is pilot-only, and what is only planned.',
      joinTitle: 'Account and listings',
      joinBody: 'Signing up, listing toys and books, browsing nearby, and declining a proposal are free. ToySwap does not take a commission on swaps.',
      deliveryTitle: 'Delivery in the pilot',
      deliveryBody: 'After both parents approve, the app may send a request to a test delivery partner (test area: around Rabka-Zdrój / southern Poland). This is not a nationwide courier network. There is no in-app price list — <strong>0 PLN in ToySwap</strong>. The partner has no published tariff yet.',
      failTitle: 'If delivery fails',
      failBody: 'A “sent to delivery” status does not mean a courier is on the way. If the partner request fails, the operator contacts the families. Items may be handed over without a courier.',
      cancelTitle: 'Cancellations',
      cancelBody: 'Declining a proposal is free. After dual approval, tell the operator — there is no automatic courier cancel, because a booking is not guaranteed.',
      damageTitle: 'Damage, loss, refunds',
      damageBody: 'We do not sell insurance and we do not process in-app refunds (there are no in-app payments). Photograph items at handover. Courier claims wait until there is a partner contract.',
      plannedTitle: 'Planned (not available)',
      plannedBody: 'Card-charged delivery fees, nationwide courier, guaranteed home collection, and automatic refunds. None of this is live — we do not promise it at registration.',
      back: '← Back'
    },
    privacy: {
      title: 'Privacy and children’s data',
      version: 'Policy version: {version}',
      intro: 'ToySwap is a closed family pilot. Only a parent or guardian can create an account. This is what we collect and what other families never see.',
      childTitle: 'Child data (minimum)',
      childBody: 'A child profile is a nickname, age range, and emoji. We do not collect a surname, exact birth year, school, a child’s email, or a face photo as an avatar.',
      parentTitle: 'Parent data',
      parentBody: 'Name, email, hashed password, and an approximate neighbourhood (area / postal code). Phone GPS is not accepted. A fuller address, if provided, is used only for delivery after both parents approve — other families never see it.',
      shareTitle: 'What other families never receive',
      share1: 'Exact location, street address, email, surname, or school',
      share2: 'They see a nickname, emoji, listing, and approximate distance in kilometres',
      share3: 'Child chat is canned messages only — no freeform text',
      retainTitle: 'How long we keep data',
      retainBody: 'Account and listings last while the account is active. After deletion we erase the database and photo files immediately. Hosted backups expire on the host’s schedule (typically within 30 days). Consent proof (policy version, email hash, time) may be kept up to 3 years where the law requires it. Full field list: project data map.',
      deleteTitle: 'Deletion',
      deleteBody: 'On My Family you can delete a child profile (listings and photos) or the whole family account. We will not delete an active exchange until you decline or finish it.',
      legalTitle: 'Legal review',
      legalBody: 'This notice is not legal advice. Before a wider EU pilot it needs qualified review for GDPR and children’s-data rules in the pilot jurisdictions.',
      back: '← Back'
    },
    auth: {
      back: '← Back to ToySwap',
      registerTitle: 'Register Your Family',
      registerHint: 'One account per parent. You’ll add your children’s profiles after registering.',
      registerNotice: 'Account, listings, and matching: 0 PLN. Pilot delivery is not charged in the app and is not guaranteed outside the test area (around Rabka-Zdrój).',
      name: 'Your name',
      email: 'Email',
      password: 'Password',
      address: 'Neighborhood / postal code (approximate is fine — no street number)',
      locationHint: 'We need an area so we can show listings inside the set radius (about 10 km by default). We do not take GPS from your phone. Other families see rounded kilometres, not your street.',
      consentLabel: 'I have read and accept the Privacy notice, Terms, Family Safety, and Community Rules linked above (version {version}). This box starts unticked and is required.',
      noMarketing: 'This is not marketing consent. ToySwap does not send newsletters or commercial offers.',
      createAccount: 'Create Account',
      loginTitle: 'Parent Login',
      logIn: 'Log In',
      noAccount: 'No account yet?',
      registerLink: 'Register your family'
    },
    dash: {
      welcome: 'Welcome, {name} 👋',
      childrenHint: 'Child profiles use a nickname and age range. Do not enter a surname, school, or date of birth.',
      noChildren: 'No children added yet.',
      yourListings: 'Your listings',
      addListing: '+ Add listing',
      listingsHint: 'Open a toy to see details, swap history, photos, and edit or delete it.',
      addChild: 'Add a Child Profile',
      childName: 'Nickname (not a surname)',
      childNameHint: 'First name or nickname only — other families will see this.',
      ageRange: 'Age range',
      ageChoose: 'Choose an age range',
      ageBand: {
        '0-2': 'Ages 0–2',
        '3-5': 'Ages 3–5',
        '6-8': 'Ages 6–8',
        '9-12': 'Ages 9–12',
        '13-17': 'Ages 13–17'
      },
      guardianLabel: 'I am the parent or legal guardian of this child and I consent to creating a profile under policy {version}. I will not submit a surname, school, address, or exact date of birth.',
      avatarNeutral: '🧒 Neutral',
      avatarBoy: '👦 Boy',
      avatarGirl: '👧 Girl',
      avatarHero: '🦸 Superhero',
      addChildBtn: 'Add Child',
      deleteChild: 'Delete profile',
      deleteChildConfirm: 'Delete {name}’s profile? Their listings and photos will also be removed. Active exchanges must be finished first.',
      familyData: 'Family data',
      deleteAccount: 'Delete family account',
      deleteAccountConfirm: 'This permanently deletes the account, child profiles, listings, photos, and swap history you are part of. Type DELETE to confirm.',
      deleteAccountPrompt: 'DELETE',
      there: 'there'
    },
    listings: {
      addChildFirst: 'Add a child profile first from <a href="#" onclick="go(\'dashboard\')">{family}</a>.',
      tapHint: 'Tap a listing to open its details. Add a new one with the form under the list.',
      addToy: 'Add a toy or book',
      addHint: 'Pick a photo from your gallery. In the pilot we add an estimated condition score — a hint, not an appraisal.',
      photoSafety: 'Photos are visible to other families immediately. Nobody reviews them first (no human queue, no safety filter). Photograph only the item — no child’s face. Prohibited items: Community rules.',
      analyzing: 'Preparing a condition estimate... 🔎',
      listingAs: 'Listing as:',
      toy: 'Toy',
      book: 'Book',
      titlePh: 'Title (e.g. Lego Castle)',
      descPh: 'Optional — no address, school, or child’s surname',
      photoGallery: 'Photo from gallery',
      analyze: 'Analyze & List',
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
      proposed: 'Exchange proposed! Both parents need to approve it under “My Exchanges”.',
      reportFamily: 'Report family'
    },
    exchanges: {
      title: 'My Exchanges',
      none: 'No exchange requests yet.',
      status: 'Status',
      approve: 'Approve',
      decline: 'Decline',
      openChat: 'Open Chat',
      bothApproved: 'Both parents approved. If the delivery partner accepts the request, we will pass it on. Still 0 PLN in the app — a courier is not guaranteed.',
      approveConfirm: 'Approval may notify the delivery partner (pilot area around Rabka-Zdrój). ToySwap charges 0 PLN. A courier is not guaranteed. Continue?',
      chatTitle: 'Chat (safe, pre-approved messages only)',
      back: '← Back',
      noMessages: 'No messages yet.',
      sendAs: 'Send as:',
      forever: 'forever',
      report: 'Report swap',
      reportMessage: 'Report message'
    },
    status: {
      pending_parent_approval: 'Waiting for parent approval',
      approved: 'Approved',
      delivery_requested: 'Sent to delivery',
      declined: 'Declined',
      removed: 'removed',
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
      ageRange: 'age {band}',
      added: 'added {date}',
      listings: 'Listings ({n})',
      noListings: 'No toys or books listed.',
      exchangesTitle: 'Exchanges ({n})',
      noExchanges: 'No exchanges yet.',
      listed: 'listed {date}',
      updated: 'Updated!',
      noChildProfiles: 'This family has no child profiles yet.',
      reports: 'Reports',
      noReports: 'No reports yet.',
      resolve: 'Resolve',
      dismiss: 'Dismiss',
      removeListing: 'Take down listing'
    },
    report: {
      button: 'Report',
      title: 'Report to the operator',
      hint: 'The pilot operator receives this. If someone is in immediate danger, call 112.',
      reason: 'Reason',
      details: 'Details (optional — no child’s personal data)',
      submit: 'Send report',
      cancel: 'Cancel',
      sent: 'Report sent. The operator will reply to the account email.',
      block: 'Block family',
      blocked: 'Family blocked. Their listings will disappear from Nearby.',
      unsafe_item: 'Unsafe item',
      child_in_photo: 'Child in a photo',
      prohibited: 'Prohibited listing',
      hygiene: 'Hygiene / condition',
      harassment: 'Harassment or chat rules',
      other: 'Other'
    },
    support: {
      label: 'Support',
      line: 'Contact: {contact}. Target reply: {hours} hours on business days. Emergency: {emergency}.',
      unconfigured: 'support address not set (SUPPORT_EMAIL)'
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
      displayNameRequired: 'A nickname is required',
      nicknameLong: 'Nickname is too long (max 40 characters)',
      nicknameInvalid: 'Use a first name or nickname only — not an email or ID',
      ageRangeRequired: 'Choose an age range',
      guardianRequired: 'Guardian confirmation is required before creating a child profile',
      privacyConsentRequired: 'You must accept the required agreements to create a family account',
      reportSubject: 'A report needs a subject',
      reportReason: 'Choose a report reason',
      reportOtherFamily: 'You can only report another family',
      reportNotFound: 'Report not found',
      childNotFound: 'Child profile not found',
      childActiveExchange: 'This child has an active exchange. Decline or finish it first.',
      familyActiveExchange: 'A child profile has an active exchange. Decline or finish it before deleting the family account.',
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
  'A nickname is required': 'errors.displayNameRequired',
  'Nickname is too long (max 40 characters)': 'errors.nicknameLong',
  'Use a first name or nickname only — not an email or ID': 'errors.nicknameInvalid',
  'Choose an age range': 'errors.ageRangeRequired',
  'Guardian confirmation is required before creating a child profile': 'errors.guardianRequired',
  'Privacy consent is required to create a family account': 'errors.privacyConsentRequired',
  'You must accept the required agreements to create a family account': 'errors.privacyConsentRequired',
  'A report needs a subject': 'errors.reportSubject',
  'Choose a report reason': 'errors.reportReason',
  'You can only report another family': 'errors.reportOtherFamily',
  'You can only block another family': 'errors.reportOtherFamily',
  'Report not found': 'errors.reportNotFound',
  'Child profile not found': 'errors.childNotFound',
  'This child has an active exchange. Decline or finish it first.': 'errors.childActiveExchange',
  'A child profile has an active exchange. Decline or finish it before deleting the family account.': 'errors.familyActiveExchange',
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
  const promo = document.querySelector('.promo-copy');
  if (promo) promo.textContent = t('home.promo');
  const footer = document.querySelector('.footer-copy');
  if (footer) footer.textContent = t('meta.footer');
  const ready = document.querySelector('.footer-ready');
  if (ready) ready.textContent = t('home.footerReady');
  const cta = document.querySelector('.footer-cta-btn');
  if (cta) cta.textContent = t('home.ctaFind');
  const costsLink = document.querySelector('.footer-costs');
  if (costsLink) costsLink.textContent = t('nav.costs');
  const privacyLink = document.querySelector('.footer-privacy');
  if (privacyLink) privacyLink.textContent = t('nav.privacy');
  const termsLink = document.querySelector('.footer-terms');
  if (termsLink) termsLink.textContent = t('nav.terms');
  const safetyLink = document.querySelector('.footer-safety');
  if (safetyLink) safetyLink.textContent = t('nav.safety');
  const rulesLink = document.querySelector('.footer-rules');
  if (rulesLink) rulesLink.textContent = t('nav.rules');
  const supportLink = document.querySelector('.footer-support');
  if (supportLink) {
    supportLink.textContent = t('support.label');
    const email = (typeof privacyMeta !== 'undefined' && privacyMeta.support && privacyMeta.support.email)
      ? privacyMeta.support.email
      : '';
    if (email) supportLink.href = `mailto:${email}`;
  }
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
