import { footerEventLinks, footerJoinLinks } from '../../data/navegacion/enlaces';

const withHref = (links: readonly { id: string; label: string }[]) =>
  links.map((link) => ({ ...link, href: '#' + link.id }));

export function useFooter() {
  return {
    eventLinks: withHref(footerEventLinks),
    joinLinks: withHref(footerJoinLinks),
  };
}
