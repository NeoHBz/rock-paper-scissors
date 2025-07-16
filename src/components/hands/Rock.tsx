import RockImg from "../../assets/rock.png";

interface RockHandProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt?: string;
}

export const RockHand: React.FC<RockHandProps> = (props) => {
  return (
    <img
      draggable={false}
      alt="Rock Hand"
      height={200}
      width={200}
      {...props}
      src={RockImg}
    />
  );
};
