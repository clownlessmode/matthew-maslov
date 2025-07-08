export const useNavigation = (itemsInCart: number = 0) => {
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
        label: `Cart ${itemsInCart > 0 ? `(${itemsInCart})` : ""}`,
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
