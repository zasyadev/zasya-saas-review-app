import { ApplaudCategoryList } from "../constants/applaudCategoryList";

export default function getApplaudCategoryName(categoryValue) {
  if (!categoryValue) return "";
  let categoryName = "";
  ApplaudCategoryList.forEach((category) => {
    let categoryData = category.data.find(
      (item) => item.value === categoryValue
    );
    if (categoryData) categoryName = categoryData.name;
  });

  return categoryName;
}
