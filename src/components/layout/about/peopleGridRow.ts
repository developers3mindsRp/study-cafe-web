/**
 * Centres the last, partly filled row of the Managers / Team grids.
 *
 * Both grids are declared as 4 columns at md and 8 at lg with every card
 * spanning 2, which leaves a half column to play with — that is what makes an
 * odd number of people sit centred instead of hugging the left edge. Only the
 * first card of the incomplete row needs a start column; the rest follow it.
 *
 * Class names are spelled out in full because Tailwind scans source text.
 */
const LG_COL_START: Record<number, string> = {
  1: 'lg:col-start-4',
  2: 'lg:col-start-3',
  3: 'lg:col-start-2',
};

const LG_CARDS_PER_ROW = 4;
const MD_CARDS_PER_ROW = 2;

export function peopleGridRowClass(index: number, total: number): string {
  const classes: string[] = [];

  const mdRemainder = total % MD_CARDS_PER_ROW;
  const mdOrphan = mdRemainder !== 0 && index === total - mdRemainder;
  if (mdOrphan) classes.push('md:col-start-2');

  const lgRemainder = total % LG_CARDS_PER_ROW;
  if (lgRemainder !== 0 && index === total - lgRemainder) {
    classes.push(LG_COL_START[lgRemainder]);
  } else if (mdOrphan) {
    // md:col-start-2 still applies at lg, so hand the column back to the flow.
    classes.push('lg:col-start-auto');
  }

  return classes.join(' ');
}
