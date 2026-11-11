/* 5% for Humanity: site logic (no tracking, no backend). */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
   * DATA
   * ---------------------------------------------------------------- */
  const REGIONS = {
    gaza:        { name: "Gaza & Palestine", code: "PS", reliefweb: "https://reliefweb.int/country/pse" },
    lebanon:     { name: "Lebanon",          code: "LB", reliefweb: "https://reliefweb.int/country/lbn" },
    iran:        { name: "Iran",             code: "IR", reliefweb: "https://reliefweb.int/country/irn" },
    congo:       { name: "DR Congo",         code: "CD", reliefweb: "https://reliefweb.int/country/cod" },
    sudan:       { name: "Sudan",            code: "SD", reliefweb: "https://reliefweb.int/country/sdn" },
    syria:       { name: "Syria",            code: "SY", reliefweb: "https://reliefweb.int/country/syr" },
    yemen:       { name: "Yemen",            code: "YE", reliefweb: "https://reliefweb.int/country/yem" },
    afghanistan: { name: "Afghanistan",      code: "AF", reliefweb: "https://reliefweb.int/country/afg" },
  };

  const NEEDS = {
    food:     "Food & water",
    shelter:  "Shelter & warmth",
    medical:  "Medical",
    children: "Children",
  };

  const CRISES = [
    {
      region: "gaza",
      photo: "gaza",
      text: "Since October 2023, war has displaced most of Gaza's 2.1 million people, many of them several times. Families shelter in tents and damaged buildings that flood in winter storms. In August 2025 UN-backed experts confirmed famine in Gaza City.",
      needs: ["Tents & tarpaulins", "Blankets", "Food parcels", "Medical care"],
    },
    {
      region: "lebanon",
      photo: "lebanon",
      text: "At its peak, the 2024 war displaced more than a million people and destroyed homes across the south, the Bekaa and Beirut's suburbs. Lebanon also hosts large numbers of Syrian and Palestinian refugees, through an economic crisis that began in 2019.",
      needs: ["Heating fuel", "Winter clothes", "Food", "Rebuilding shelter"],
    },
    {
      region: "iran",
      photo: "iran",
      text: "Families face economic hardship, the aftermath of the June 2025 war and frequent earthquakes. Iran hosts one of the world's largest refugee populations, most of them Afghans. Sanctions make it hard for aid to get in, so licensed organisations matter.",
      needs: ["Food", "Children's education", "Winter kits", "Health care"],
    },
    {
      region: "congo",
      photo: "congo",
      text: "Decades of conflict in the east have forced millions of people from their homes. Fighting around Goma and Bukavu in 2025 brought new waves of displacement. In the rainy season, overcrowded camps flood and disease spreads fast.",
      needs: ["Shelter", "Clean water", "Food", "Care for survivors"],
    },
    {
      region: "sudan",
      photo: "sudan",
      text: "Since war broke out in April 2023, Sudan has become the world's largest displacement crisis, with more than 10 million people forced from home. Famine has been confirmed in several areas, including parts of Darfur.",
      needs: ["Food", "Clean water", "Shelter", "Medical care"],
    },
    {
      region: "syria",
      photo: "syria",
      text: "Millions of people are still displaced after years of war, many in camps in the north-west where snow and floods collapse tents every winter. Families returning home often find their houses destroyed.",
      needs: ["Heating & fuel", "Blankets", "Shelter repair", "Health care"],
    },
    {
      region: "yemen",
      photo: "yemen",
      text: "Yemen remains one of the world's worst humanitarian crises. Years of war, a collapsed economy, hunger and disease mean most of the population needs aid to survive.",
      needs: ["Food", "Clean water", "Medical care", "Children's nutrition"],
    },
    {
      region: "afghanistan",
      photo: "afghanistan",
      text: "Mountain winters, earthquakes, economic collapse and the return of millions of Afghans from Iran and Pakistan leave families without enough food or warm shelter.",
      needs: ["Winter kits", "Food", "Shelter", "Health care"],
    },
  ];

  // type: "local" = based in / led from the affected country; "intl" = international organisation
  const CHARITIES = [
    // --- Gaza & Palestine ---
    { name: "UNRWA", url: "https://donate.unrwa.org", type: "intl",
      desc: "The UN agency for Palestine refugees. It runs shelters, food distribution, schools and clinics in Gaza, the West Bank, Lebanon and Syria.",
      regions: ["gaza", "lebanon", "syria"], needs: ["food", "shelter", "medical", "children"] },
    { name: "Medical Aid for Palestinians (MAP)", url: "https://www.map.org.uk", type: "intl",
      desc: "UK charity providing emergency medical supplies, health services and support to Palestinian health workers in Gaza, the West Bank and Lebanon's camps.",
      regions: ["gaza", "lebanon"], needs: ["medical"] },
    { name: "Palestine Children's Relief Fund (PCRF)", url: "https://www.pcrf.net", type: "intl",
      desc: "Medical care for injured and sick Palestinian children, plus humanitarian relief such as food, water and shelter in Gaza.",
      regions: ["gaza", "lebanon"], needs: ["medical", "children", "food"] },
    { name: "Anera", url: "https://www.anera.org", type: "intl",
      desc: "Has worked on the ground for decades, delivering food, medicine, hygiene kits and shelter supplies in Gaza, the West Bank and Lebanon.",
      regions: ["gaza", "lebanon"], needs: ["food", "shelter", "medical"] },
    { name: "Taawon (Welfare Association)", url: "https://www.taawon.org/en", type: "local",
      desc: "One of the largest Palestinian-led NGOs, providing emergency relief, education and development across Palestine and in Lebanon's camps.",
      regions: ["gaza"], needs: ["food", "shelter", "children"] },
    { name: "UK-Med", url: "https://www.uk-med.org", type: "intl",
      desc: "Deploys frontline medical teams and runs field hospitals in emergencies, including in Gaza and Sudan.",
      regions: ["gaza", "sudan"], needs: ["medical"] },
    { name: "World Central Kitchen", url: "https://wck.org", type: "intl",
      desc: "Serves hot meals and food kits at scale in crisis zones, working with local cooks and kitchens.",
      regions: ["gaza", "lebanon"], needs: ["food"] },

    // --- Lebanon ---
    { name: "Lebanese Red Cross", url: "https://www.redcross.org.lb", type: "local",
      desc: "Lebanon's main emergency medical and ambulance service, also distributing relief to displaced families.",
      regions: ["lebanon"], needs: ["medical", "shelter"] },
    { name: "Amel Association", url: "https://amel.org", type: "local",
      desc: "Lebanese NGO running health centres and mobile clinics and providing relief for Lebanese, Syrian and Palestinian families.",
      regions: ["lebanon"], needs: ["medical", "food", "children"] },
    { name: "Basmeh & Zeitooneh", url: "https://www.basmeh-zeitooneh.org", type: "local",
      desc: "Community organisation in Lebanon's camps and poorest neighbourhoods, providing relief, education and winter support.",
      regions: ["lebanon"], needs: ["shelter", "children", "food"] },
    { name: "Lebanese Food Bank", url: "https://www.lebanesefoodbank.org", type: "local",
      desc: "Collects and distributes food to vulnerable families across Lebanon.",
      regions: ["lebanon"], needs: ["food"] },
    { name: "Impact Lebanon", url: "https://www.impactlebanon.org", type: "local",
      desc: "Diaspora-led organisation that funds vetted grassroots relief and recovery projects inside Lebanon.",
      regions: ["lebanon"], needs: ["food", "shelter"] },

    // --- Iran ---
    { name: "Child Foundation", url: "https://www.childfoundation.org", type: "intl",
      desc: "Supports children in poverty with food, education and health care. Its programmes include Iran and Afghanistan.",
      regions: ["iran", "afghanistan"], needs: ["children", "food"] },
    { name: "IFRC (Red Cross & Red Crescent)", url: "https://www.ifrc.org", type: "intl",
      desc: "Global federation backing national societies, including the Iranian Red Crescent, through emergency appeals for earthquakes, conflict and displacement.",
      regions: ["iran", "afghanistan", "syria", "yemen", "sudan"], needs: ["shelter", "food", "medical"] },
    { name: "UNHCR, the UN Refugee Agency", url: "https://www.unhcr.org", type: "intl",
      desc: "Provides shelter, winter kits and cash help to refugees and displaced families, including Afghan refugees in Iran and the displaced in Sudan, DR Congo and Lebanon.",
      regions: ["iran", "sudan", "congo", "lebanon", "syria", "afghanistan", "yemen"], needs: ["shelter", "food"] },

    // --- DR Congo ---
    { name: "Panzi Foundation", url: "https://panzifoundation.org", type: "local",
      desc: "Founded by Nobel Peace laureate Dr Denis Mukwege. Provides medical, psychological and legal care to survivors of sexual violence in eastern DRC.",
      regions: ["congo"], needs: ["medical"] },
    { name: "HEAL Africa", url: "https://www.healafrica.org", type: "local",
      desc: "Goma-based hospital and community health organisation serving eastern DRC.",
      regions: ["congo"], needs: ["medical", "children"] },
    { name: "Concern Worldwide", url: "https://www.concern.net", type: "intl",
      desc: "Delivers emergency food, water and shelter and fights hunger in fragile places including DR Congo, Sudan, Syria, Lebanon and Afghanistan.",
      regions: ["congo", "sudan", "syria", "lebanon", "afghanistan"], needs: ["food", "shelter"] },

    // --- Sudan ---
    { name: "Sadagaat", url: "https://www.sadagaat-uk.org", type: "local",
      desc: "Sudanese community charity providing food, clean water, health care and education to families across Sudan.",
      regions: ["sudan"], needs: ["food", "medical", "children"] },
    { name: "World Food Programme (WFP)", url: "https://www.wfp.org", type: "intl",
      desc: "The UN's food agency. It delivers emergency food to millions of people in Sudan, Gaza, DR Congo, Yemen, Afghanistan and beyond.",
      regions: ["sudan", "gaza", "congo", "yemen", "afghanistan", "syria", "lebanon"], needs: ["food"] },
    { name: "Action Against Hunger", url: "https://www.actionagainsthunger.org", type: "intl",
      desc: "Treats malnutrition and provides food, water and sanitation in conflict zones.",
      regions: ["sudan", "gaza", "congo", "yemen", "lebanon", "syria", "afghanistan"], needs: ["food", "children", "medical"] },
    { name: "MedGlobal", url: "https://www.medglobal.org", type: "intl",
      desc: "Sends doctors and supports local health workers in crisis zones, including Gaza and Sudan.",
      regions: ["gaza", "sudan", "syria", "yemen"], needs: ["medical"] },

    // --- Syria / Afghanistan ---
    { name: "Syrian American Medical Society (SAMS)", url: "https://www.sams-usa.net", type: "local",
      desc: "Supports hospitals, clinics and medical staff inside Syria and for Syrian refugees in neighbouring countries.",
      regions: ["syria", "lebanon"], needs: ["medical"] },
    { name: "The White Helmets (Syria Civil Defence)", url: "https://www.whitehelmets.org", type: "local",
      desc: "Syrian volunteer rescue workers who respond to attacks, earthquakes and winter floods across Syria.",
      regions: ["syria"], needs: ["shelter", "medical"] },
    { name: "Afghanaid", url: "https://www.afghanaid.org.uk", type: "local",
      desc: "Has worked in rural Afghanistan for decades, providing winter support, food and emergency response after earthquakes.",
      regions: ["afghanistan"], needs: ["shelter", "food"] },

    // --- Global, multi-crisis ---
    { name: "Médecins Sans Frontières (MSF)", url: "https://www.msf.org", type: "intl",
      desc: "Independent medical humanitarian organisation running hospitals and clinics in war zones and outbreaks worldwide.",
      regions: ["gaza", "lebanon", "sudan", "congo", "syria", "yemen", "afghanistan"], needs: ["medical"] },
    { name: "International Committee of the Red Cross (ICRC)", url: "https://www.icrc.org", type: "intl",
      desc: "Protects and assists people affected by armed conflict. It provides food, water, medical care and shelter on the front lines.",
      regions: ["gaza", "lebanon", "sudan", "congo", "syria", "yemen", "afghanistan"], needs: ["medical", "food", "shelter"] },
    { name: "UNICEF", url: "https://www.unicef.org", type: "intl",
      desc: "The UN children's agency. It provides nutrition, clean water, vaccines, winter clothing and education for children in emergencies.",
      regions: ["gaza", "lebanon", "sudan", "congo", "syria", "yemen", "afghanistan", "iran"], needs: ["children", "food", "medical"] },
    { name: "International Rescue Committee (IRC)", url: "https://www.rescue.org", type: "intl",
      desc: "Helps people affected by conflict and disaster to survive and recover, with health care, cash aid and protection.",
      regions: ["sudan", "congo", "syria", "yemen", "afghanistan", "lebanon"], needs: ["medical", "food", "shelter"] },
    { name: "Save the Children", url: "https://www.savethechildren.net", type: "intl",
      desc: "Emergency food, health care, protection and winter support for children in crisis zones worldwide.",
      regions: ["gaza", "lebanon", "sudan", "congo", "syria", "yemen", "afghanistan"], needs: ["children", "food", "medical"] },
    { name: "Islamic Relief", url: "https://www.islamic-relief.org", type: "intl",
      desc: "Faith-inspired aid agency running winter appeals, food packs and emergency relief. Offers zakat-compliant giving.",
      regions: ["gaza", "lebanon", "sudan", "syria", "yemen", "afghanistan", "congo"], needs: ["food", "shelter", "children"] },
    { name: "Human Appeal", url: "https://www.humanappeal.org.uk", type: "intl",
      desc: "Emergency food, water, shelter and winter kits for families in conflict and disaster zones. Offers zakat-compliant giving.",
      regions: ["gaza", "lebanon", "syria", "yemen", "sudan", "afghanistan"], needs: ["food", "shelter"] },
    { name: "Muslim Hands", url: "https://muslimhands.org.uk", type: "intl",
      desc: "Runs winter appeals, food distribution and emergency relief in crisis zones. Offers zakat-compliant giving.",
      regions: ["gaza", "syria", "yemen", "afghanistan", "sudan"], needs: ["food", "shelter"] },
    { name: "ShelterBox", url: "https://www.shelterbox.org", type: "intl",
      desc: "Provides emergency shelter, such as tents, tarpaulins, blankets and household kits, to families who have lost their homes.",
      regions: ["syria", "congo", "yemen", "afghanistan", "sudan"], needs: ["shelter"] },
    { name: "Norwegian Refugee Council (NRC)", url: "https://www.nrc.no", type: "intl",
      desc: "Provides shelter, food, clean water, education and legal aid to displaced people in more than 40 countries.",
      regions: ["gaza", "lebanon", "sudan", "congo", "syria", "yemen", "afghanistan", "iran"], needs: ["shelter", "food", "children"] },
    { name: "Oxfam", url: "https://www.oxfam.org", type: "intl",
      desc: "Provides clean water, sanitation, food and cash assistance in emergencies.",
      regions: ["gaza", "lebanon", "sudan", "congo", "syria", "yemen", "afghanistan"], needs: ["food"] },
    { name: "Direct Relief", url: "https://www.directrelief.org", type: "intl",
      desc: "Ships medicines and medical supplies to health facilities in crisis zones around the world.",
      regions: ["gaza", "lebanon", "sudan", "syria", "yemen", "afghanistan"], needs: ["medical"] },
  ];

  /* ------------------------------------------------------------------
   * HELPERS
   * ---------------------------------------------------------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const el = (tag, attrs = {}, children = []) => {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else node.setAttribute(k, v);
    }
    [].concat(children).forEach((c) => c && node.append(c));
    return node;
  };
  const store = {
    get(key) { try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; } },
    set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* ignore */ } },
  };
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
  }
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = el("textarea", { style: "position:fixed;opacity:0" });
      ta.value = text;
      document.body.append(ta);
      ta.select();
      try { document.execCommand("copy"); } catch (err) { /* ignore */ }
      ta.remove();
    }
    toast("Copied to clipboard");
  }
  const pageUrl = () => location.href.split("#")[0];

  /* ------------------------------------------------------------------
   * NAV
   * ---------------------------------------------------------------- */
  const toggle = $(".nav-toggle");
  const links = $("#nav-links");
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ------------------------------------------------------------------
   * CRISES
   * ---------------------------------------------------------------- */
  const PHOTOS = window.PHOTOS || {};
  function credit(key) {
    const p = PHOTOS[key];
    if (!p) return null;
    const frag = document.createDocumentFragment();
    frag.append(`${p.place} · ${p.date} · Photo: ${p.credit} · `);
    frag.append(el("a", { href: p.license_url || p.page, target: "_blank", rel: "noopener", text: p.license }));
    return frag;
  }
  function photoImg(key, attrs = {}) {
    const p = PHOTOS[key];
    return el("img", { src: p.src, alt: p.alt, loading: "lazy", width: p.w, height: p.h, ...attrs });
  }

  const crisisGrid = $("#crisis-grid");
  CRISES.forEach((c) => {
    const r = REGIONS[c.region];
    const seeBtn = el("a", { class: "btn btn-primary", href: "#charities", "data-region": c.region, text: "Help here" });
    seeBtn.addEventListener("click", () => setRegion(c.region));
    crisisGrid.append(
      el("article", { class: "crisis-card" }, [
        PHOTOS[c.photo] ? el("figure", { class: "crisis-media" }, [
          photoImg(c.photo),
          el("span", { class: "code", "aria-hidden": "true", text: r.code }),
        ]) : null,
        el("div", { class: "crisis-body" }, [
          el("h3", { text: r.name }),
          el("p", { text: c.text }),
          el("ul", { class: "crisis-needs", "aria-label": "Urgent needs" }, c.needs.map((n) => el("li", { text: n }))),
          el("div", { class: "crisis-actions" }, [
            seeBtn,
            el("a", { class: "link-quiet", href: r.reliefweb, target: "_blank", rel: "noopener", text: "Latest reports ↗" }),
          ]),
          el("p", { class: "photo-caption" }, credit(c.photo)),
        ]),
      ])
    );
  });

  /* ------------------------------------------------------------------
   * HERO SLIDESHOW: one real photograph per situation
   * ---------------------------------------------------------------- */
  const HERO_FOCUS = { hero: "18% 40%" }; // keep the people in frame when the photo is cropped
  const HERO = ["hero", "sudan", "lebanon", "afghanistan"].filter((k) => PHOTOS[k]);
  const slides = $("#hero-slides");
  const dots = $("#hero-dots");
  let heroIndex = 0;
  let heroTimer;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  HERO.forEach((k, i) => {
    const img = photoImg(k, { loading: i === 0 ? "eager" : "lazy", alt: "", class: i === 0 ? "active" : "" });
    if (HERO_FOCUS[k]) img.style.objectPosition = HERO_FOCUS[k];
    slides.append(img);
    const b = el("button", { type: "button", "aria-label": "Show photo: " + PHOTOS[k].place, "aria-pressed": String(i === 0) });
    b.addEventListener("click", () => { showSlide(i); restartHero(); });
    dots.append(b);
  });
  function showSlide(i) {
    heroIndex = i;
    slides.querySelectorAll("img").forEach((img, j) => img.classList.toggle("active", j === i));
    dots.querySelectorAll("button").forEach((b, j) => b.setAttribute("aria-pressed", String(j === i)));
    const cap = $("#hero-caption");
    cap.replaceChildren();
    const c = credit(HERO[i]);
    if (c) cap.append(PHOTOS[HERO[i]].alt + ". ", c);
  }
  function restartHero() {
    clearInterval(heroTimer);
    if (!reduceMotion && HERO.length > 1) heroTimer = setInterval(() => showSlide((heroIndex + 1) % HERO.length), 8000);
  }
  if (HERO.length) { showSlide(0); restartHero(); }

  /* Photo slots in the page: filled only when the photo exists */
  document.querySelectorAll("figure[data-photo]").forEach((fig) => {
    const key = fig.dataset.photo;
    if (!PHOTOS[key]) { fig.hidden = true; return; }
    fig.append(photoImg(key), el("figcaption", { class: "photo-caption" }, credit(key)));
  });
  document.querySelectorAll("img[data-photo-bg]").forEach((img) => {
    const p = PHOTOS[img.dataset.photoBg];
    if (p) { img.src = p.src; img.hidden = false; }
  });

  /* Static photo captions and the credits list */
  document.querySelectorAll("[data-credit]").forEach((node) => {
    const c = credit(node.dataset.credit);
    if (c) node.append(c);
  });
  const creditsList = $("#credits-list");
  Object.values(PHOTOS).forEach((p) => {
    creditsList.append(el("li", {}, [
      el("a", { href: p.page, target: "_blank", rel: "noopener", text: p.alt }),
      ` (${p.place}, ${p.date}). Photo: ${p.credit}. Licence: `,
      el("a", { href: p.license_url || p.page, target: "_blank", rel: "noopener", text: p.license }),
      ". Resized for the web.",
    ]));
  });

  /* ------------------------------------------------------------------
   * CALCULATOR
   * ---------------------------------------------------------------- */
  const CURRENCIES = ["USD", "GBP", "EUR", "CAD", "AUD", "PKR", "INR", "BDT", "AED", "SAR", "QAR", "KWD", "TRY", "MYR", "IDR", "ZAR", "NGN", "CHF", "SEK", "NOK"];
  const REGION_CURRENCY = {
    US: "USD", GB: "GBP", IE: "EUR", DE: "EUR", FR: "EUR", NL: "EUR", ES: "EUR", IT: "EUR", BE: "EUR", AT: "EUR",
    CA: "CAD", AU: "AUD", PK: "PKR", IN: "INR", BD: "BDT", AE: "AED", SA: "SAR", QA: "QAR", KW: "KWD",
    TR: "TRY", MY: "MYR", ID: "IDR", ZA: "ZAR", NG: "NGN", CH: "CHF", SE: "SEK", NO: "NOK",
  };
  $("#calc-form").addEventListener("submit", (e) => e.preventDefault());
  const currencySel = $("#currency");
  CURRENCIES.forEach((c) => currencySel.append(el("option", { value: c, text: c })));
  const saved = store.get("calc") || {};
  const localeRegion = (navigator.language || "en-US").split("-")[1];
  currencySel.value = saved.currency || REGION_CURRENCY[localeRegion] || "USD";
  if (saved.salary != null) $("#salary").value = saved.salary;
  if (saved.percent != null) $("#percent").value = saved.percent;

  const SPLIT = [
    { label: "Food & clean water", pct: 35, color: "#f08a3c" },
    { label: "Warm clothes & blankets", pct: 25, color: "#d9a33b" },
    { label: "Shelter & heating", pct: 25, color: "#6f93c4" },
    { label: "Medical care", pct: 15, color: "#4f9a78" },
  ];

  function fmt(n, cur, compact) {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency", currency: cur,
        maximumFractionDigits: n >= 100 || compact ? 0 : 2,
        notation: compact && n >= 1e6 ? "compact" : "standard",
      }).format(n);
    } catch (e) {
      return cur + " " + Math.round(n).toLocaleString();
    }
  }

  function updateCalc() {
    const salary = Math.max(0, parseFloat($("#salary").value) || 0);
    const pct = parseFloat($("#percent").value) || 5;
    const cur = currencySel.value;
    $("#percent-out").textContent = (pct % 1 ? pct.toFixed(1) : pct) + "%";
    const month = (salary * pct) / 100;
    $("#r-month").textContent = fmt(month, cur);
    $("#r-day").textContent = fmt(month / 30, cur);
    $("#r-winter").textContent = fmt(month * 3, cur);
    $("#r-year").textContent = fmt(month * 12, cur);
    $("#r-multi").textContent = fmt(month * 3 * 1000, cur, true) + " for winter relief";

    const split = $("#split");
    split.replaceChildren(
      ...SPLIT.map((s) =>
        el("li", {}, [
          el("span", { text: s.label + " · " + s.pct + "%" }),
          el("strong", { text: fmt((month * s.pct) / 100, cur) }),
          el("span", { class: "bar" }, el("span", { style: `width:${s.pct * 2.5}%;background:${s.color}` })),
        ])
      )
    );
    store.set("calc", { salary: $("#salary").value, percent: pct, currency: cur });
  }
  ["#salary", "#percent", "#currency"].forEach((s) => $(s).addEventListener("input", updateCalc));
  updateCalc();

  /* ------------------------------------------------------------------
   * CHARITY DIRECTORY
   * ---------------------------------------------------------------- */
  const state = { region: "all", need: "all", q: "" };
  const urlRegion = new URLSearchParams(location.search).get("region");
  if (urlRegion && REGIONS[urlRegion]) state.region = urlRegion;

  function makeChips(container, entries, key) {
    container.replaceChildren(
      ...entries.map(([value, label]) => {
        const b = el("button", { type: "button", class: "chip", "data-value": value, "aria-pressed": String(state[key] === value), text: label });
        b.addEventListener("click", () => { state[key] = value; syncChips(); renderCharities(); });
        return b;
      })
    );
  }
  function syncChips() {
    document.querySelectorAll("#region-chips .chip").forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.value === state.region)));
    document.querySelectorAll("#need-chips .chip").forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.value === state.need)));
  }
  function setRegion(r) { state.region = r; syncChips(); renderCharities(); }

  const SITUATION_DEFAULT = "gaza2";
  function renderSituation() {
    const region = state.region;
    const crisis = CRISES.find((c) => c.region === region);
    const key = crisis && PHOTOS[crisis.photo] ? crisis.photo : SITUATION_DEFAULT;
    const p = PHOTOS[key];
    const img = $("#situation-img");
    if (p && img.getAttribute("src") !== p.src) {
      img.classList.add("fading");
      setTimeout(() => { img.src = p.src; img.alt = p.alt; img.classList.remove("fading"); }, reduceMotion ? 0 : 250);
    } else if (p) { img.alt = p.alt; }
    $("#situation-place").textContent = region === "all" ? "Everywhere the need is greatest" : REGIONS[region].name;
    $("#situation-line").textContent = region === "all"
      ? "Choose a place below to see the organisations helping there."
      : crisis.needs.join(" · ") + ". These organisations are working there now.";
    const cap = $("#situation-credit");
    cap.replaceChildren();
    const c = credit(key);
    if (c) cap.append(c);
  }

  makeChips($("#region-chips"), [["all", "All places"], ...Object.entries(REGIONS).map(([k, v]) => [k, v.name])], "region");
  makeChips($("#need-chips"), [["all", "All needs"], ...Object.entries(NEEDS)], "need");
  $("#search").addEventListener("input", (e) => { state.q = e.target.value.trim().toLowerCase(); renderCharities(); });

  function renderCharities() {
    const grid = $("#charity-grid");
    let list = CHARITIES.filter((c) =>
      (state.region === "all" || c.regions.includes(state.region)) &&
      (state.need === "all" || c.needs.includes(state.need)) &&
      (!state.q || (c.name + " " + c.desc).toLowerCase().includes(state.q))
    );
    // When a place is selected, show local organisations first.
    if (state.region !== "all") list = list.slice().sort((a, b) => (a.type === b.type ? 0 : a.type === "local" ? -1 : 1));

    renderSituation();
    const placeLabel = state.region === "all" ? "" : " for " + REGIONS[state.region].name;
    $("#result-count").textContent = `${list.length} organisation${list.length === 1 ? "" : "s"}${placeLabel}`;

    if (!list.length) {
      grid.replaceChildren(el("div", { class: "empty", text: "No charities match those filters. Try a different place or need." }));
      return;
    }
    grid.replaceChildren(
      ...list.map((c) => {
        const host = c.url.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
        return el("article", { class: "charity-card" }, [
          el("div", { class: "charity-top" }, [
            el("h3", { text: c.name }),
            el("span", { class: "charity-type " + (c.type === "local" ? "type-local" : "type-intl"), text: c.type === "local" ? "Local" : "International" }),
          ]),
          el("p", { text: c.desc }),
          el("div", { class: "tags" }, [
            ...c.regions.map((r) => el("span", { class: "tag", text: REGIONS[r].name })),
            ...c.needs.map((n) => el("span", { class: "tag tag-need", text: NEEDS[n] })),
          ]),
          el("a", { class: "btn btn-primary", href: c.url, target: "_blank", rel: "noopener", text: "Donate on official site ↗" }),
          el("span", { class: "charity-url", text: host }),
        ]);
      })
    );
  }
  renderCharities();

  /* ------------------------------------------------------------------
   * PLEDGE
   * ---------------------------------------------------------------- */
  const causeSel = $("#p-cause");
  causeSel.append(el("option", { value: "all", text: "Wherever the need is greatest" }));
  Object.entries(REGIONS).forEach(([k, v]) => causeSel.append(el("option", { value: k, text: "The people of " + v.name })));

  function pledgeMessage(p) {
    const place = p.cause === "all" ? "families in Gaza, Lebanon, Iran, Congo, Sudan and other crisis zones" : "families in " + REGIONS[p.cause].name;
    return `I've pledged to give 5% of my salary this winter to help ${place} stay warm, fed and sheltered. Will you join me? #5PercentForHumanity`;
  }

  function showPledge(p) {
    const msg = pledgeMessage(p);
    const full = msg + " " + pageUrl();
    $("#pledge-msg").textContent = (p.name ? `Thank you, ${p.name}! ` : "Thank you! ") + "Now share your pledge:\n\n“" + msg + "”";
    $("#share-wa").href = "https://wa.me/?text=" + encodeURIComponent(full);
    $("#share-x").href = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(msg) + "&url=" + encodeURIComponent(pageUrl());
    $("#share-fb").href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(pageUrl());
    $("#share-copy").onclick = () => copyText(full);
    $("#ics-btn").onclick = () => downloadICS(p);
    $("#pledge-done").hidden = false;
  }

  const savedPledge = store.get("pledge");
  if (savedPledge) {
    $("#p-name").value = savedPledge.name || "";
    causeSel.value = savedPledge.cause || "all";
    $("#p-day").value = savedPledge.day || 1;
    showPledge(savedPledge);
  }

  $("#pledge-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const day = Math.min(28, Math.max(1, parseInt($("#p-day").value, 10) || 1));
    $("#p-day").value = day;
    const p = { name: $("#p-name").value.trim().slice(0, 40), cause: causeSel.value, day };
    store.set("pledge", p);
    showPledge(p);
    toast("Pledge saved. Thank you!");
  });

  function downloadICS(p) {
    const now = new Date();
    let start = new Date(now.getFullYear(), now.getMonth(), p.day);
    if (start < new Date(now.getFullYear(), now.getMonth(), now.getDate())) start = new Date(now.getFullYear(), now.getMonth() + 1, p.day);
    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1);
    const d = (x) => `${x.getFullYear()}${String(x.getMonth() + 1).padStart(2, "0")}${String(x.getDate()).padStart(2, "0")}`;
    const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
    const place = p.cause === "all" ? "people in crisis" : "the people of " + REGIONS[p.cause].name;
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//5PercentForHumanity//Winter Pledge//EN", "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:${stamp}-${Math.random().toString(36).slice(2)}@5percentforhumanity`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${d(start)}`,
      `DTEND;VALUE=DATE:${d(end)}`,
      "RRULE:FREQ=MONTHLY;COUNT=4",
      `SUMMARY:Payday: give 5% for ${place}`,
      `DESCRIPTION:Your 5% Winter Pledge. Choose a charity: ${pageUrl()}#charities`,
      `URL:${pageUrl()}#charities`,
      "BEGIN:VALARM", "TRIGGER:PT9H", "ACTION:DISPLAY", "DESCRIPTION:Give your 5% today", "END:VALARM",
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar" });
    const a = el("a", { href: URL.createObjectURL(blob), download: "5-percent-winter-pledge.ics" });
    document.body.append(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  /* ------------------------------------------------------------------
   * SHARE SITE
   * ---------------------------------------------------------------- */
  $("#share-site").addEventListener("click", async () => {
    const data = { title: "5% for Humanity: Winter Appeal", text: "This winter, give 5% of your salary to keep families in crisis zones warm, fed and sheltered.", url: pageUrl() };
    if (navigator.share) {
      try { await navigator.share(data); return; } catch (e) { if (e.name === "AbortError") return; }
    }
    copyText(data.text + " " + data.url);
  });
})();
