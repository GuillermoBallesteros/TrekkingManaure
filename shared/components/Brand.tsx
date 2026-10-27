import marca from '../assets/images/marca/logo-trekking-perija.png';

export default function Brand() {
  return (
    <span className="brand">
      <span className="brand__mark">
        <img src={marca} alt="" />
      </span>
      <span className="brand__text">
        <span className="brand__name">Trekking Perijá</span>
        <span className="brand__sub">Manaure · Cesar</span>
      </span>
    </span>
  );
}
