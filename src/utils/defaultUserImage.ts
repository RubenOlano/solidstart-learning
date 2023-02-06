export const getImage = (url?: string | null): string => {
  return (
    url ||
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png"
  );
};
