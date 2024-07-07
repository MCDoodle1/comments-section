const CustomButton = ({ name, icon: Icon, onClick, className, type }) => {
  return (
    <button type={type} onClick={onClick} className={className}>
      {Icon && <Icon />} <p>{name}</p>
    </button>
  );
};
export default CustomButton;
