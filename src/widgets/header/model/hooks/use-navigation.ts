export const useNavigation = (cartItemsCount: number) => {
  return {
    navigation: [
      {
        label: "Home",
        href: "/",
      },
      {
        label: "Lookbook",
        href: "/lookbook",
      },
      {
        label: `Cart ${cartItemsCount > 0 ? `(${cartItemsCount})` : ""}`,
        href: "/cart",
      },
    ],
    socials: [
      {
        label: "TG",
        href: "https://t.me/matthewmaslov",
      },
      {
        label: "INST",
        href: "https://www.instagram.com/matthewmaslov/",
      },
    ],
  };
};
