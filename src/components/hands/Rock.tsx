import RockImg from "../../assets/rock.png";

interface RockHandProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt?: string;
  smallHands?: boolean;
}

export const RockHand: React.FC<RockHandProps> = (props) => {
  return (
    <img
      draggable={false}
      alt="Rock Hand"
      height={props.smallHands ? 100 : 200}
      width={props.smallHands ? 100 : 200}
      {...props}
      src={RockImg}
    />
  );
};
