import ScissorsImg from "../../assets/scissors.png";

interface ScissorsHandProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt?: string;
}

export const ScissorsHand: React.FC<ScissorsHandProps> = (props) => {
  return (
    <img
      draggable={false}
      alt="Scissors Hand"
      height={200}
      width={200}
      {...props}
      src={ScissorsImg}
    />
  );
};
