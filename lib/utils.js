export function getReviewPopupTime() {
  const review_popup_time = localStorage.getItem("review_popup_time");
  return review_popup_time ?? "";
}

export function setReviewPopupTime(date) {
  if (date == null) {
    localStorage.removeItem("review_popup_time");
  } else {
    localStorage.setItem("review_popup_time", date);
  }
}
