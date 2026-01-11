import axios from "axios";

export const fetchReviews = async () => {
  const response = await axios.get(
    "https://opensheet.elk.sh/1QlvLlMvheNhrzgwJ9AhnMy_Ms2VfG8FjT2NC3IL0eVE/Sheet1"
  );
  return response.data;
};
