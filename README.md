# Yu-Gi-Oh! Hand Calculator (Mobile)

An intuitive, lightweight, and mobile-optimized hand probability calculator and opening-hand simulator for **Yu-Gi-Oh!**. Built with modern web technologies and wrapped with **Capacitor**, this app lets you test deck consistency, evaluate card density, and run opening-hand simulations directly on your Android device.

---

### Desktop Version
Looking for the web/desktop version of this tool? Check out the original project repository here:
👉 [**Yu-Gi-Oh! Hypergeometric Hand Calculator (Desktop)**](https://github.com/IvanGSilva/yugioh_hypergeometric_hand_calculator)

---

## Features

* **Hypergeometric Probability Engine:** Accurately calculate the exact mathematical odds of drawing your key card combinations in your opening hand.
* **Monte Carlo Hand Simulator:** Simulate 5 or 6-card opening hands on the fly with smooth, touch-friendly horizontal scrolling.
* **Dynamic Card Categorization:** Tag your deck's cards as **Starters**, **Extenders**, **Non-Engine**, or **Bricks** to get deep insights into your deck's ratios.
* **Density & Priority Analysis:** View visual breakdowns and priority ordering to fine-tune your deck building before attending local tournaments or competitive events.
* **Mobile-First Responsive Design:** Clean, dark-mode UI optimized for small screens, one-handed navigation, and seamless performance.
* **YDK File Support:** Easily load your deck lists directly using standard `.ydk` files.

---

## Interface Preview

<table border="0">
  <tr>
    <td width="25%">
      <img src="img/1.jpeg" alt="Screen 1" width="100%">
    </td>
    <td width="25%">
      <img src="img/2.jpeg" alt="Screen 2" width="100%">
    </td>
    <td width="25%">
      <img src="img/3.jpeg" alt="Screen 3" width="100%">
    </td>
    <td width="25%">
      <img src="img/4.jpeg" alt="Screen 4" width="100%">
    </td>
  </tr>
</table>


---

## Installation (Android)

You can install the app directly on your Android device using the standalone APK from the Releases section:

1. Go to the [**Releases**](https://github.com/IvanGSilva/yugioh-hand-calculator-mobile/releases) tab in this repository.
2. Download the latest **`yugioh-hand-calculator.apk`** (or `app-debug.apk`).
3. Open the downloaded file on your Android device.
4. If prompted, grant permission to *"Install apps from unknown sources"* for your file browser.
5. Launch the app and test your hands!

---

## How to use this app

**1. Get Your `.ydk` Deck File**
The app uses standard `.ydk` files (the universal deck format used by simulator software). You can get or create one in a few ways:
* **Export from Simulators:** Build or open a deck in **EDOPro**, **YGOPro**, or **Project Ignis**, and export/save it as a `.ydk` file.
* **Download Online:**
  * **[YGOProDeck](https://ygoprodeck.com/):** Browse top tournament decks, click on any deck list, and select **"Download YDK File"**.
  * **[YGOScope](https://ygoscope.com/):** Export match-tested competitive lists directly into `.ydk`.
* **Export from Yu-Gi-Oh! Neuron:** Share/export your deck layout into `.ydk` format.


**2. Import Your Deck**
1. Open the **Yu-Gi-Oh! Hand Calculator** app on your phone.
2. Tap the **"Load .YDK File"** button at the top of the workspace.
3. Select the `.ydk` file from your device's file storage. The app will automatically parse the file and list all Main Deck cards along with their artwork.


**3. Categorize Your Cards**
To get accurate statistical analysis, assign roles to your cards by tapping the tags on each card entry:
* **🟢 Starter:** Key cards that initiate your main plays/combos single-handedly (e.g., *Tour Guide*, *Branded Fusion*, *Aluber*).
* **🔵 Extender:** Cards that extend your plays or provide follow-up when you already have a play going.
* **🟣 Non-Engine:** Staples, handtraps, and board breakers (e.g., *Ash Blossom*, *Infinite Impermanence*, *Nibiru*).
* **🔴 Brick:** Cards you prefer NOT to draw in your opening hand (e.g., *Garnets*, specific soft-brick search targets).

> *Note: Cards can have multiple tags assigned depending on your engine logic!*


**4. Run Probability & Hand Simulations**
* **Probability Engine:** Adjust your desired sample size (5 cards for 1st turn, 6 cards for 2nd turn) and set target drawing conditions to see your exact mathematical odds of opening specific combinations.
* **Monte Carlo Simulator:** Tap **"Simulate Opening Hands"** to generate realistic 5 or 6-card test hands. Swipe horizontally on any hand row to view your full drawn hand!
* **Density Breakdown:** Check the visual stats panel at the bottom to evaluate your deck's overall balance and adjust card ratios before your next duel.

---

## Tech Stack & Built With

* **Frontend:** HTML5, Custom CSS3 (Flexbox & CSS Grid), Pure JavaScript (ES6+)
* **Mobile Wrapper:** [Capacitor JS](https://capacitorjs.com/) (Native Android bridge)
* **Design/UI:** Custom Dark Theme tailored for mobile viewports (`100vw` constrained layout, custom touch-scrollbars)

---

## Local Development Setup

If you want to clone and run or build the project locally:

```bash
# 1. Clone the repository
git clone [https://github.com/IvanGSilva/yugioh-hand-calculator-mobile.git](https://github.com/IvanGSilva/yugioh-hand-calculator-mobile.git)

# 2. Enter the project directory
cd yugioh-hand-calculator-mobile

# 3. Install Node dependencies
npm install

# 4. Sync web assets with the Android native project
npx cap sync android
```

## Contributing & Feedback

Feel free to open an Issue or submit a Pull Request if you run into any bugs, have ideas for new features, or want to contribute to the calculator's engine!

## License

This project is open-source under the MIT License.
