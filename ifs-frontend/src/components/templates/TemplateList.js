import { useDispatch } from "react-redux";
import { getContentsData } from "../../store/contents-actions";

const TemplateList = () => {
  const dispatch = useDispatch();

  const getContentsDataHandler = () => {
    dispatch(getContentsData());
  };
  return (
    <ul>
      <li>Template 1</li>
      <li>Template 2</li>
      <li>Template 3</li>
      <button type="button" onClick={getContentsDataHandler}>
        Get Contents Data
      </button>
    </ul>
  );
};

export default TemplateList;
