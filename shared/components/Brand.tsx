import Icon from './Icon';

export default function Brand() {
  return (
    <span className="brand">
      <span className="brand__mark">
        <Icon name="mountain" />
      </span>
      <span className="brand__text">
        <span className="brand__name">Trekking Perijá</span>
        <span className="brand__sub">Manaure · Cesar</span>
      </span>
    </span>
  );
}
