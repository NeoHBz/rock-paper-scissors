import PaperImg from "../../assets/paper.png";

interface PaperHandProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt?: string;
}

export const PaperHand: React.FC<PaperHandProps> = (props) => {
  return (
    <img
      draggable={false}
      alt="Paper Hand"
      height={200}
      width={200}
      {...props}
      src={PaperImg}
    />
  );
};
