let ddMmYyyy = () => {
  const o_date = new Intl.DateTimeFormat();
  const f_date = (m_ca, m_it) => Object({ ...m_ca, [m_it.type]: m_it.value });
  const { day, month, year } = o_date.formatToParts().reduce(f_date, {});

  return `${day}/${month}/${year}`;
};

module.exports = {
  ddMmYyyy: ddMmYyyy,
};
