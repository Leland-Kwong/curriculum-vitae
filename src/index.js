import css from './style.scss';
import content from './cv-data';

const TYPES = {
  string: 0,
  array: 1,
  null: 2
};

const valueType = (v) => {
  if (typeof v === 'undefined') {
    return TYPES.null;
  }
  if (Array.isArray(v)) {
    return TYPES.array;
  }
  return TYPES.string;
};

const html = (strings, ...vals) => {
  return strings.map((s, i) => {
    const v = vals[i];
    const type = valueType(v);
    const normalizedString = !s.trim() ? '' : s;
    switch(type) {
      case TYPES.null:
        return normalizedString + '';
      case TYPES.array:
        return normalizedString + v.join('');
      default:
        return normalizedString + v;
    }
  }).join('');
};

const CVSource = html`
  <a
    href="https://github.com/Leland-Kwong/curriculum-vitae"
  >
    &lt;view source&gt;
  </a>
`;

const Link = ({ href, content }) => {
  const isEmail = href.indexOf('@') !== -1;
  return html`
    <a href="${isEmail && 'mailto:'}${href}">${content}</a>
  `;
};

const Header = html`
  <header class="flex justify-between">
    <div>
      <h1 class="ma0 f3">${content.name}</h1>
      <div class="ttc">${content.title}</div>
      <div class="flex">
        ${content.webPresence.map(({ desc, link }) => html`
          <div class="comma-seperated">
            <a href="${link}">${desc}</a>
          </div>
        `)}
      </div>
      <div>${CVSource}</div>
    </div>
    <ul class="list pl0 ma0">
      <li>
        <span class="w4-ns dib tr">e</span>
        ${Link({
          href: content.contactInfo.email,
          content: content.contactInfo.email
        })}
      </li>
      <li>
        <span class="w4-ns dib tr">w</span>
        <a href="${content.website}">${content.website}</a>
      </li>
      <li>
        <span class="w4-ns dib tr">p</span>
        <span>${content.contactInfo.phone}</span>
      </li>
    </ul>
  </header>
`;

const Style = (css = '') => html`
  <style>${css}</style>
`;

const Section = (title, content) => {
  const SectionTitle = title
    ? html`
      <h3 class="SectionTitle ttu f5 tracked">
        ${title}
      </h3>
    `
    : '';
  return html`
    <section class="Section">
      ${SectionTitle}
      ${content}
    </section>
  `;
};

const WorkDatesSummary = ({ start, end }) => {
  const [m1, y1] = start.split('/');
  const [m2, y2] = end.split('/');
  const d1 = new Date(`${m1}/01/${y1}`);
  const d2 = new Date(`${m2}/01/${y2}`);
  const totalMonths = Math.round(
    (d2 - d1) / 1000 / 60 / 60 / 24 / 30
  );
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const yearText = years ? years + ' yr ' : '';
  const monthText = months ? months + ' mos' : '';
  return `${yearText}${monthText}`;
};

const WorkDates = (date) => {
  const { start, end } = date;

  const DateSummary = end
    ? html`
      <span> ∙ </span>
      <span>${WorkDatesSummary({ start, end })}</span>
    `
    : '';
  return html`
    <div>
      <time>${start}</time>
      <span>-</span>
      <time>${end || 'present'}</time>
      ${DateSummary}
    </div>
  `;
};

const WorkExperience = () => {
  const exp = content.experience.map(({
    company,
    website,
    date,
    role,
    summary = '',
    techStack = [],
    responsibilities = []
  }) => {
    const ResponsibilitiesList = responsibilities.length
      ? html`
        <ul>
          ${responsibilities.map(r => html`
            <li>${r}</li>
          `)}
        </ul>
      `
      : '';


    const TechStack = html`
      <div class="TechStack">
        <div class="ttu f7">
          Tech Stack
        </div>
        <ul class="flex flex-wrap list pl0 mt1">
          ${techStack.map(stack => html`
            <li class="Tag bg-light-gray">${stack}</li>
          `)}
        </ul>
      </div>
    `;
    const CompanyNameClasses = 'CompanyName color-inherit';
    const CompanyName = website
      ? html`
        <a href="${website}" class="${CompanyNameClasses}">
          ${company}
        </a>
      `
      : html`
        <div class="${CompanyNameClasses}">
          ${company}
        </div>
      `;
    return html`
      <div class="ExperienceBlock mb4">
        <ul class="ExperienceMeta list pl0">
          <li class="ttc f4 fw6">${role}</li>
          <li>${CompanyName}</li>
          <li>${WorkDates(date)}</li>
        </ul>
        <p>${summary}</p>
        ${TechStack}
        ${ResponsibilitiesList}
      </div>
    `;
  });
  return exp;
};

const Education = () => Section(
  'education',
  html`
<ul class="list pl0">
  ${content.education.map(({
    school,
    degree,
    years: [yearStart, yearEnd],
    education,
  }) => {
    return html`
      <li class="mb4">
        <div class="ttc f4 fw6">${school}</div>
        <div class="i">${degree}</div>
        <div>${education}</div>
        <div>
          <time>${yearStart}</time>
          <span>-</span>
          <time>${yearEnd}</time>
        </div>
      </li>
    `;
  })}
</ul>
`);

const OtherInterests = (items = []) => html`
  <ul class="list pl0 flex flex-wrap">
    ${items.map(item => html`
      <li class="Tag bg-washed-red">${item}</li>
    `)}
  </ul>
`;

const htmlContent = html`
  ${Style(css)}
  ${Section(
    null,
    Header
  )}
  ${Section(
    null,
    html`<p>${content.summary}</p>`
  )}
  ${Section(
    'experience',
    WorkExperience()
  )}
  ${Section(
    'interests & hobbies',
    OtherInterests(content.interestsAndHobbies)
  )}
  ${Education()}
`;

const render = (html = '') => {
  const elem = document.createElement('div');
  elem.innerHTML = html;
  document.body.appendChild(elem);
};

render(htmlContent);
