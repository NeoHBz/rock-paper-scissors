import PaperImg from "../../assets/paper.png";

interface PaperHandProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt?: string;
  smallHands?: boolean;
}

export const PaperHand: React.FC<PaperHandProps> = (props) => {
  return (
    <img
      draggable={false}
      alt="Paper Hand"
      height={props.smallHands ? 100 : 200}
      width={props.smallHands ? 100 : 200}
      {...props}
      src={PaperImg}
    />
  );
};
