/*
 * Ridha Cloud — site settings.
 * This is the only file you need to edit to change the phone number or the menu.
 */
window.RIDHA = {
  name: "Ridha Cloud",
  city: "Kozhikode, Kerala",

  // WhatsApp number that receives orders: country code + number, digits only.
  // Example for an Indian number: "919876543210"
  // While this is empty, WhatsApp opens and asks the customer to pick a contact.
  whatsappNumber: "919030595999",

  // How many days ahead an order must be placed.
  leadDays: 1,

  // Party order slider range (guests).
  party: { min: 10, max: 500, step: 5, start: 50 },

  // MENU — sample Malabar dishes. Replace with the real menu.
  // ml is the Malayalam name shown beside the category; image is its round photo.
  // price is optional: put a number (in rupees) to show it, or null to hide it.
  // unit is what one quantity means: "portion", "piece", "kg", "glass"...
  menu: [
    {
      id: "breads",
      ml: "പത്തിരി",
      image: "images/cat-breads.jpg",
      title: "Pathiri & breads",
      note: "Made for the curry beside them",
      items: [
        { id: "ari-pathiri", name: "Ari Pathiri", desc: "Paper-thin rice flour bread", unit: "piece", price: null },
        { id: "orotti", name: "Orotti", desc: "Thick rice-flour roti with coconut, cooked on a clay pan", unit: "piece", price: null },
        { id: "ney-pathiri", name: "Ney Pathiri", desc: "Deep-fried rice bread with coconut and shallot", unit: "piece", price: null },
        { id: "malabar-parotta", name: "Malabar Parotta", desc: "Flaky layered flatbread", unit: "piece", price: null },
        { id: "chatti-pathiri", name: "Chatti Pathiri", desc: "Layered pastry with spiced chicken filling", unit: "portion", price: null }
      ]
    },
    {
      id: "curries",
      ml: "കറികൾ",
      image: "images/cat-curries.jpg",
      title: "Curries & fries",
      note: "Coconut, curry leaf and roasted spice",
      items: [
        { id: "chicken-curry", name: "Malabar Chicken Curry", desc: "Roasted coconut gravy", unit: "portion", price: null },
        { id: "beef-varattiyathu", name: "Beef Varattiyathu", desc: "Dry-roasted beef with coconut slices", unit: "portion", price: null },
        { id: "mutton-stew", name: "Mutton Stew", desc: "Mild coconut-milk stew with potato", unit: "portion", price: null },
        { id: "fish-curry", name: "Malabar Fish Curry", desc: "Red curry soured with tamarind", unit: "portion", price: null },
        { id: "kozhi-porichathu", name: "Kozhi Porichathu", desc: "Malabar-style fried chicken", unit: "portion", price: null }
      ]
    },
    {
      id: "biryani",
      ml: "ബിരിയാണി",
      image: "images/cat-biryani.jpg",
      title: "Biryani & rice",
      note: "Kozhikodan style, short-grain kaima rice",
      items: [
        { id: "chicken-biryani", name: "Chicken Biryani", desc: "Dum-cooked with kaima rice, fried onion and ghee", unit: "portion", price: null },
        { id: "mutton-biryani", name: "Mutton Biryani", desc: "Tender mutton layered with fragrant rice", unit: "portion", price: null },
        { id: "beef-biryani", name: "Beef Biryani", desc: "Slow-cooked beef masala under rice", unit: "portion", price: null },
        { id: "fish-biryani", name: "Fish Biryani", desc: "Fried fish in a tangy masala, layered with rice", unit: "portion", price: null },
        { id: "neychoru", name: "Neychoru (Ghee Rice)", desc: "Ghee rice with cashew, raisins and fried onion", unit: "portion", price: null }
      ]
    },
    {
      id: "snacks",
      ml: "പലഹാരം",
      image: "images/cat-snacks.jpg",
      title: "Malabar snacks",
      note: "Tea-time palaharam",
      items: [
        { id: "unnakkaya", name: "Unnakkaya", desc: "Ripe plantain rolls filled with coconut and egg", unit: "piece", price: null },
        { id: "pazham-nirachathu", name: "Pazham Nirachathu", desc: "Stuffed ripe plantain, fried", unit: "piece", price: null },
        { id: "kallummakkaya", name: "Kallummakkaya Nirachathu", desc: "Mussels stuffed with spiced rice dough", unit: "piece", price: null },
        { id: "erachi-pathiri", name: "Erachi Pathiri", desc: "Fried bread stuffed with spiced meat", unit: "piece", price: null },
        { id: "chicken-cutlet", name: "Chicken Cutlet", desc: "Crumb-fried chicken and potato", unit: "piece", price: null }
      ]
    },
    {
      id: "sweets",
      ml: "മധുരം",
      image: "images/cat-sweets.jpg",
      title: "Sweets & drinks",
      note: "To finish",
      items: [
        { id: "mutta-mala", name: "Mutta Mala", desc: "Egg-yolk threads in sugar syrup", unit: "portion", price: null },
        { id: "halwa", name: "Kozhikodan Halwa", desc: "The city's own, glossy and chewy", unit: "kg", price: null },
        { id: "payasam", name: "Payasam", desc: "Ask for the payasam of the day", unit: "portion", price: null },
        { id: "sulaimani", name: "Sulaimani", desc: "Spiced black tea with lemon", unit: "glass", price: null }
      ]
    }
  ]
};
