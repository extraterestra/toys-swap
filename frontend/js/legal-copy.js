const LEGAL_COPY = {
  pl: {
    terms: {
      title: 'Regulamin',
      intro: 'To zasady korzystania z zamkniętego pilotażu ToySwap. Nie zastępują opinii prawnej. Wersja pakietu jest widoczna poniżej.',
      sections: [
        {
          title: 'Czym jest ToySwap',
          body: 'ToySwap to zamknięty pilotaż dla zaproszonych rodzin: rodzic zakłada konto, dzieci mają profile, a rodziny mogą proponować wymianę zabawek i książek w ustawionym promieniu. To nie jest publiczny marketplace i nie ma płatności w aplikacji (0 zł).'
        },
        {
          title: 'Kto może korzystać',
          body: 'Konto zakłada wyłącznie rodzic albo opiekun prawny. Dziecko nie może samo się zarejestrować. Dodając profil dziecka, potwierdzasz opiekę prawną. Nie podajesz nazwiska, szkoły, adresu ani daty urodzenia dziecka.'
        },
        {
          title: 'Twoja odpowiedzialność za ogłoszenia',
          body: 'Rodzic odpowiada za treść ogłoszenia, zdjęcia i stan przedmiotu. Musisz przestrzegać Zasad społeczności (m.in. zakaz niebezpiecznych i wycofanych z rynku produktów). ToySwap nie wycenia przedmiotów i nie gwarantuje, że ocena stanu jest poprawna.'
        },
        {
          title: 'Wymiana i dostawa',
          body: 'Wymiana wymaga zgody obu rodziców. Aplikacja może potem wysłać zgłoszenie do testowego partnera dostaw (obszar testowy: okolice Rabki-Zdroju). Kurier nie jest gwarantowany. Aplikacja nie wymaga spotkania, ale przekazanie poza kurierem może być potrzebne, jeśli dostawa nie zadziała. Szczegóły: strona Koszty i dostawa.'
        },
        {
          title: 'Komunikacja',
          body: 'Między dziećmi działają wyłącznie gotowe komunikaty. Zakazane jest obchodzenie tego (np. dane kontaktowe w tytule ogłoszenia albo na zdjęciu).'
        },
        {
          title: 'Konto, zawieszenie, usunięcie',
          body: 'Możesz usunąć profil dziecka albo konto rodziny w „Moja rodzina”. Operator może zawiesić konto albo zdjąć ogłoszenie po zgłoszeniu, naruszeniu zasad albo wymogu prawa. Aktywnej wymiany nie usuniesz, dopóki jej nie odrzucisz lub nie dokończysz.'
        },
        {
          title: 'Ograniczenie odpowiedzialności (pilotaż)',
          body: 'Usługa jest pilotażem „tak jak jest”. Nie gwarantujemy dostępności, kuriera, jakości przedmiotu ani tego, że inna rodzina wywiąże się z wymiany. W zakresie dozwolonym prawem odpowiedzialność operatora za szkody związane z korzystaniem z pilotażu jest ograniczona. To nie wyłącza odpowiedzialności, której prawo nie pozwala wyłączyć.'
        },
        {
          title: 'Prawo właściwe',
          body: 'Pilotaż jest przygotowywany z myślą o rodzinach w Polsce / UE. Spory staramy się rozwiązać bezpośrednio. Dokumenty czekają na przegląd prawny — patrz wniosek o review w dokumentacji projektu.'
        }
      ]
    },
    safety: {
      title: 'Bezpieczeństwo rodziny',
      intro: 'Rodzic nadzoruje każde konto, ogłoszenie i wymianę. Poniżej jest to, co aplikacja naprawdę robi — bez obietnic, których nie spełniamy.',
      sections: [
        {
          title: 'Nadzór rodzica',
          body: 'Dziecko działa tylko przez konto rodzica. Obie strony muszą zatwierdzić wymianę. Nie ma otwartego czatu. Inne rodziny widzą ksywkę i przedział wieku, nie nazwisko, szkołę, e-mail ani dokładny adres.'
        },
        {
          title: 'Zdjęcia — kto sprawdza i kiedy',
          body: '<strong>Nie ma automatycznej ani ludzkiej moderacji zdjęć przed publikacją.</strong> Ogłoszenie jest widoczne dla rodzin w promieniu od razu po wystawieniu. Kolumna „moderation_status” w systemie jest pusta w praktyce. Szacunek stanu (Claude albo makieta) to ocena kondycji zabawki, nie filtr bezpieczeństwa i nie wykrywanie CSAM.'
        },
        {
          title: 'Co odrzucamy i jak zdejmujemy ogłoszenie',
          body: 'Po <em>zgłoszeniu</em> operator (konto administratora) przegląda sprawę. Cel: odpowiedź w czasie podanym przy kontakcie wsparcia (domyślnie 48 godzin w dni robocze). Możemy zdjąć ogłoszenie (status „removed”) albo poprosić o usunięcie. Rodzic może sam usunąć swoje zdjęcia i ogłoszenia w każdej chwili. Nie obiecujemy skanowania wszystkich zdjęć z wyprzedzeniem.'
        },
        {
          title: 'Czego nie wolno fotografować',
          body: 'Tylko przedmiot, na neutralnym tle. Zakaz: twarz lub ciało dziecka, mundurek / szkoła, dokumenty, adres, inni ludzie bez zgody, nagość, przemoc, treść dla dorosłych. Jeśli na zdjęciu widać dziecko — nie wystawiaj; usuń i zgłoś, jeśli zobaczysz takie ogłoszenie u kogoś innego.'
        },
        {
          title: 'Komunikacja',
          body: 'Tylko gotowe komunikaty. Zakaz namawiania do spotkania bez wiedzy rodzica, wymiany telefonu, social mediów albo adresu w ogłoszeniu.'
        },
        {
          title: 'Dostawa i przekazanie',
          body: 'Po podwójnej zgodzie możemy wysłać zgłoszenie do partnera testowego. Kurier nie jest gwarantowany. Aplikacja nie wymaga spotkania rodzin. Jeśli przekazujecie osobiście, robią to dorośli. Przy odbiorze zróbcie zdjęcie stanu. ToySwap nie ubezpiecza przesyłki.'
        },
        {
          title: 'Zgłaszanie',
          body: 'Przy ogłoszeniu, ksywce na karcie, wymianie i czacie jest przycisk „Zgłoś”. Wybierz powód. Zgłoszenie trafia do operatora. W nagłym zagrożeniu życia lub zdrowia dzwoń <strong>112</strong> — nie czekaj na e-mail.'
        },
        {
          title: 'Blokowanie',
          body: '„Blokuj rodzinę” ukrywa ich ogłoszenia u Ciebie i Twoje u nich. Istniejące wymiany zostają, żeby można było je odrzucić. Blokada nie jest wyrokiem i nie zastępuje zgłoszenia.'
        },
        {
          title: 'Odwołania',
          body: 'Nie ma osobnego formularza odwołań w aplikacji. Jeśli zdejmiemy ogłoszenie albo konto, napisz na adres wsparcia w ciągu 14 dni. Operator ponownie czyta sprawę. To pilotaż: decyzje mogą zająć do zadeklarowanego czasu odpowiedzi.'
        },
        {
          title: 'Eskalacja nagła',
          body: 'Podejrzenie przestępstwa, krzywdy dziecka albo treści seksualnej z udziałem małoletniego: <strong>112</strong> albo lokalna policja / sąd rodzinny, potem e-mail do operatora z numerem zgłoszenia (bez przesyłania nielegalnych obrazów mailem).'
        }
      ]
    },
    rules: {
      title: 'Zasady społeczności',
      intro: 'Te zasady dotyczą ogłoszeń, zdjęć, komunikacji, dostawy i zachowania. Naruszenie może skończyć się zdjęciem ogłoszenia albo konta.',
      sections: [
        {
          title: 'Co wolno wystawiać',
          body: 'Używane zabawki i książki dla dzieci, kompletne na tyle, by dało się z nich korzystać, czyste i suche. Kategoria w aplikacji: zabawka albo książka.'
        },
        {
          title: 'Zakazane ogłoszenia',
          body: 'Broń i repliki broni, petardy, chemikalia, leki, suplementy, żywność, zwierzęta, pieniądze, dane osobowe, konta cyfrowe, podróbki, treść dla dorosłych, papierosy / e-papierosy / alkohol, ostre narzędzia poza zabawkami jednoznacznie dla dzieci i w dobrym stanie.'
        },
        {
          title: 'Niebezpieczne produkty',
          body: 'Nie wystawiaj rzeczy z luźnymi małymi elementami dla dzieci, które mogą je połknąć, z uszkodzonym akumulatorem albo baterią pastylkową, ostrymi krawędziami, odsłoniętym okablowaniem, pleśnią, silnym uszkodzeniem mechanicznym albo bez wymaganych osłon. Jeśli nie jesteś pewien bezpieczeństwa — nie wystawiaj.'
        },
        {
          title: 'Wycofania z rynku (recalls)',
          body: 'Przed wystawieniem sprawdź, czy produkt nie został wycofany (np. komunikaty UOKiK, producenta albo sieci sklepów). Wycofanej rzeczy nie wolno wymieniać przez ToySwap.'
        },
        {
          title: 'Higiena',
          body: 'Przed zdjęciem: umyj / wytrzyj przedmiot, książki bez wilgoci i pleśni, pluszaki po praniu jeśli to możliwe, bez resztek jedzenia. Nie wystawiaj rzeczy z pasożytami, silnym zapachem albo wydzieliną.'
        },
        {
          title: 'Nieodpowiednie wiekowo',
          body: 'Nie wystawiaj gier i filmów 16+/18+, treści erotycznych, horrorów dla dorosłych, zabawek imitujących używki albo materiałów, których Twoje dziecko nie powinno dostać. Dobieraj ogłoszenie do wieku — inne rodziny widzą tylko przedział wieku na profilu, nie dokładny wiek.'
        },
        {
          title: 'Zachowanie',
          body: 'Zakaz nękania, gróźb, dyskryminacji, nachalnego kontaktu poza aplikacją, publikowania danych innej rodziny oraz obchodzenia zgody drugiego rodzica. Dzieci nie prowadzą negocjacji poza gotowymi komunikatami.'
        },
        {
          title: 'Dostawa',
          body: 'Nie składaj fałszywych zgłoszeń do kuriera. Po zatwierdzeniu współpracuj z operatorem, jeśli partner nie przyjmie zgłoszenia. Nie zostawiaj paczki bez opieki dziecka.'
        }
      ]
    }
  },
  en: {
    terms: {
      title: 'Terms',
      intro: 'These are the rules for the closed ToySwap pilot. They are not legal advice. The pack version is shown below.',
      sections: [
        {
          title: 'What ToySwap is',
          body: 'ToySwap is a closed pilot for invited families: a parent creates the account, children have profiles, and families may propose toy and book swaps inside a set radius. It is not a public marketplace and there are no in-app payments (0 PLN).'
        },
        {
          title: 'Who may use it',
          body: 'Only a parent or legal guardian may create an account. A child cannot self-register. Adding a child profile confirms guardianship. Do not submit a surname, school, address, or date of birth for the child.'
        },
        {
          title: 'Your responsibility for listings',
          body: 'The parent is responsible for listing text, photos, and item condition. You must follow the Community Rules (including no unsafe or recalled products). ToySwap does not appraise items and does not guarantee that the condition score is correct.'
        },
        {
          title: 'Swaps and delivery',
          body: 'A swap needs both parents’ approval. The app may then send a request to a test delivery partner (test area: around Rabka-Zdrój). A courier is not guaranteed. The app does not require a meetup, but handover without a courier may still be needed if delivery fails. See Costs & delivery.'
        },
        {
          title: 'Communication',
          body: 'Children may send canned messages only. Do not work around this (for example contact details in a title or on a photo).'
        },
        {
          title: 'Account, suspension, deletion',
          body: 'You may delete a child profile or the family account from My Family. The operator may suspend an account or take down a listing after a report, a rules breach, or a legal requirement. You cannot delete an active exchange until you decline or finish it.'
        },
        {
          title: 'Limitation of liability (pilot)',
          body: 'The service is a pilot provided “as is”. We do not guarantee uptime, a courier, item quality, or that the other family will complete the swap. To the extent the law allows, the operator’s liability for using the pilot is limited. This does not exclude liability that cannot legally be excluded.'
        },
        {
          title: 'Governing law',
          body: 'The pilot is aimed at families in Poland / the EU. We try to resolve disputes directly. These documents await qualified legal review — see the project’s legal-review request.'
        }
      ]
    },
    safety: {
      title: 'Family safety',
      intro: 'A parent supervises every account, listing, and swap. This is what the app actually does — we do not promise reviews we do not run.',
      sections: [
        {
          title: 'Parent supervision',
          body: 'A child acts only through a parent account. Both sides must approve a swap. There is no open chat. Other families see a nickname and age range, not a surname, school, email, or exact address.'
        },
        {
          title: 'Photos — who reviews, and when',
          body: '<strong>There is no automated or human photo moderation before a listing is published.</strong> Nearby families can see it immediately. The `moderation_status` field is unused in practice. The condition estimate (Claude or a mock) scores the toy, not safety, and is not CSAM detection.'
        },
        {
          title: 'What is rejected and how removal works',
          body: 'After a <em>report</em>, the operator (admin account) reviews it. Target: a reply within the support response time (48 hours on business days by default). We may take the listing down (status “removed”) or ask you to delete it. You may delete your own photos and listings at any time. We do not promise to scan every photo in advance.'
        },
        {
          title: 'What not to photograph',
          body: 'Photograph only the item, on a plain background. Do not include a child’s face or body, a school uniform, documents, an address, other people without consent, nudity, violence, or adult content. If a child is visible, do not list it; delete it and report it if you see someone else’s listing like that.'
        },
        {
          title: 'Communication',
          body: 'Canned messages only. Do not push for an unsupervised meetup or swap a phone number, social account, or address in a listing.'
        },
        {
          title: 'Delivery and handover',
          body: 'After dual approval we may notify a test partner. A courier is not guaranteed. The app does not require families to meet. If you hand over in person, adults do it. Photograph condition at handover. ToySwap does not insure the shipment.'
        },
        {
          title: 'Reporting',
          body: 'Listings, the nickname on a card, exchanges, and chat have a Report control. Pick a reason. The operator receives it. If someone is in immediate danger, call <strong>112</strong> — do not wait for email.'
        },
        {
          title: 'Blocking',
          body: 'Block family hides their listings from you and yours from them. Existing exchanges stay so you can decline them. A block is not a verdict and does not replace a report.'
        },
        {
          title: 'Appeals',
          body: 'There is no in-app appeals form. If we remove a listing or account, email support within 14 days. The operator re-reads the case. This is a pilot: a decision may take the stated response time.'
        },
        {
          title: 'Emergency escalation',
          body: 'Suspected crime, harm to a child, or sexual content involving a minor: call <strong>112</strong> or local police / family court, then email the operator with a ticket number (do not email illegal images).'
        }
      ]
    },
    rules: {
      title: 'Community rules',
      intro: 'These rules cover listings, photos, communication, delivery, and behaviour. A breach can take down a listing or an account.',
      sections: [
        {
          title: 'What you may list',
          body: 'Used children’s toys and books that still work, clean and dry. In-app category: toy or book.'
        },
        {
          title: 'Prohibited listings',
          body: 'Weapons and realistic weapon replicas, fireworks, chemicals, medicines, supplements, food, animals, money, personal data, digital accounts, counterfeits, adult content, cigarettes / vapes / alcohol, and sharp tools that are not clearly children’s toys in good condition.'
        },
        {
          title: 'Unsafe products',
          body: 'Do not list items with loose small parts a young child could swallow, damaged batteries or button cells, sharp edges, exposed wiring, mould, severe breakage, or missing guards. If you are unsure it is safe, do not list it.'
        },
        {
          title: 'Recalls',
          body: 'Before listing, check whether the product has been recalled (for example UOKiK, the manufacturer, or a retailer). Recalled items may not be swapped on ToySwap.'
        },
        {
          title: 'Hygiene',
          body: 'Clean or wipe the item before you photograph it. Books must be dry and free of mould; wash plush toys where you can; no food residue. Do not list items with pests, a strong odour, or bodily fluids.'
        },
        {
          title: 'Age-inappropriate items',
          body: 'Do not list 16+/18+ games or films, erotic content, adult horror, toys that mimic drugs or alcohol, or anything your child should not receive. Match the listing to age — other families only see an age range, not an exact age.'
        },
        {
          title: 'Behaviour',
          body: 'No harassment, threats, discrimination, pestering off-app, publishing another family’s details, or bypassing the other parent’s approval. Children do not negotiate beyond canned messages.'
        },
        {
          title: 'Delivery',
          body: 'Do not file fake courier requests. After approval, work with the operator if the partner does not accept the job. Do not leave a parcel in a child’s care.'
        }
      ]
    }
  }
};

function getLegalCopy(pageKey) {
  const lang = typeof getLang === 'function' && getLang() === 'en' ? 'en' : 'pl';
  return LEGAL_COPY[lang][pageKey] || LEGAL_COPY.pl[pageKey];
}
