import ScissorsImg from "../../assets/scissors.png";

interface ScissorsHandProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt?: string;
  smallHands?: boolean;
}

export const ScissorsHand: React.FC<ScissorsHandProps> = (props) => {
  return (
    <img
      draggable={false}
      alt="Scissors Hand"
      height={props.smallHands ? 100 : 200}
      width={props.smallHands ? 100 : 200}
      {...props}
      src={ScissorsImg}
    />
  );
};
