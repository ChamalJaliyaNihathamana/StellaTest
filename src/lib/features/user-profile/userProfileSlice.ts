// user-profile/userProfileSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserProfileState {
  existingWardrobe: string;
  profession: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserProfileState = {
  existingWardrobe: `Cream-colored silk blouse: This elegant blouse features a high collar with a tie closure and long, voluminous sleeves. The fabric appears to be lightweight and drapes beautifully.
  White silk blouse: This classic blouse has a Mandarin collar and a button-front closure. The silk fabric has a subtle sheen, giving it a luxurious look.
  Pink silk skirt: This delicate skirt appears to be made of a lightweight silk fabric with a subtle sheen. It has a relaxed fit and falls to about knee length.
  Light pink ruffled blouse: This romantic blouse is crafted from a sheer, lightweight fabric and features delicate ruffles along the neckline and sleeves. The soft pink color adds a feminine touch.
  Bright pink blouse: This vibrant blouse is made from a smooth, opaque fabric and has a simple, yet stylish design. The bold pink color makes a statement.
  Black blazer with zippered pocket: This modern blazer features a sleek, tailored silhouette and a unique zippered pocket on the front. The black color makes it versatile and easy to pair with different outfits.
  Gray and black houndstooth blazer: This classic blazer has a double-breasted design and a timeless houndstooth pattern. The neutral colors make it a versatile piece that can be dressed up or down.
  Black blazer with floral pattern: This sophisticated blazer features a subtle floral pattern that adds a touch of elegance. The black color and tailored fit make it suitable for both formal and casual occasions.
  Pink tweed jacket with embellishments: This luxurious jacket is made from a textured tweed fabric and features intricate embellishments, including pearls and crystals. The soft pink color and delicate details create a feminine and glamorous look.
  
  Zebra Striped Dress: This black and white dress with a bold zebra stripe print offers a striking and dramatic look.
  Styling: Pair it with black heels and a statement necklace for a night out, or dress it down with sandals and a denim jacket for a more casual vibe. A red lip would add a pop of color and enhance the boldness of the zebra print.
  Floral Print Dress: The Isabel Marant dress boasts a flowing silhouette with a red and white floral pattern against a cream background. The pattern is abstract and organic, offering a softer feel than the zebra print.
  Styling: Dress it up with heels and elegant jewelry for a garden party or summer wedding. Alternatively, pair it with flats and a straw hat for a charming daytime look. A light cardigan in a complementary color could add warmth and dimension to the outfit.
  Black Dress with Subtle Pattern: This dress appears to have a dark, muted pattern, possibly a tonal animal print or a textured design. The details are difficult to discern from the video.
  Styling: Depending on the specific pattern and fabric, this versatile dress could be styled for various occasions. For a chic evening look, consider adding metallic accessories and a clutch. For a more relaxed approach, pair it with boots and a leather jacket.
  Plaid Blazer (Blazer #1): This blazer features a classic grey and black plaid pattern in a double-breasted style, offering a timeless and sophisticated look.
  Styling: Pair it with tailored trousers or a skirt and blouse for a polished office ensemble. For a more relaxed outfit, try it with jeans and a t-shirt. Adding a pop of color with a bright scarf or statement earrings can personalize the look.
  Textured Blazer (Blazer #2): The video shows a Chanel tweed jacket with black as the dominant color and hints of brown or red woven into the fabric, offering a luxurious and textured look.
  Styling: Pair it with a skirt or dress for an elegant ensemble suitable for special events or dressy occasions. For a more modern take, consider pairing it with jeans and a silk camisole.
  Black Sheer Blouse: This delicate blouse adds a touch of sensuality and intrigue to any outfit.
  Styling: Layer it over a camisole or dress for a layered look, or wear it on its own for a bolder statement. Pair it with tailored pants for a sophisticated style or with a skirt for a more feminine touch.
  White Blouse: This classic white blouse is a versatile wardrobe staple.
  Styling: Dress it up with a skirt or dress pants for the office, or dress it down with jeans for a casual weekend look. Accessorize with a statement necklace or scarf to add personality.
  
  1. Khaite Ivory Silk Blouse with Draped Detail:
  Brand: Khaite
  Color: Ivory white
  Fabric: Lightweight, flowy silk
  Design features: Long sleeves, relaxed fit, unique draped scarf or cape detail extending from the shoulders down the front
  2. L'Agence White Collared Blouse:
  Brand: L'Agence
  Color: White
  Fabric: Smooth, refined fabric with a slight sheen (likely silk or a similar material)
  Design features: Classic collar, button-down front, long sleeves, relaxed yet tailored fit
  3. Equipment Zebra-Striped Tunic Dress:
  Brand: Equipment
  Color/Pattern: Black and white zebra stripe
  Fabric: Silky, smooth fabric with a slight sheen (likely a satin or silk blend)
  Design features: Collared neckline, button-down front, long sleeves, relaxed fit, tunic length (falling around the knee or slightly longer)
  4. Cami NYC Black Camisole:
  Brand: Cami NYC
  Color: Black
  Fabric: Smooth, luxurious silk
  Design features: V-neckline, adjustable spaghetti straps
  5. Anine Bing White Camisole:
  Brand: Anine Bing
  Color: White
  Fabric: Smooth, potentially satin or silk-like material
  Design features: Scoop neckline, adjustable spaghetti straps
  6. Magda Butrym Black Bodysuit with Built-in Bra:
  Brand: Magda Butrym
  Color: Black
  Fabric: Stretchy, form-fitting fabric (likely a blend of polyamide and elastane)
  Design features: Built-in underwire bra with molded cups, adjustable straps, thong bottom
  7. Fendi Black Tuxedo Blazer:
  Brand: Fendi
  Color: Black
  Fabric: Structured, suiting fabric (likely wool or a wool blend) with satin details
  Design features: Notched lapels with satin facing, single button closure, tailored fit, flap pockets
  8. Saint Laurent Oversized Blazer:
  Brand: Saint Laurent (YSL)
  Color/Pattern: Black and white Prince of Wales check
  Fabric: Mid-weight suiting fabric with a textured appearance (possibly wool or a blend)
  Design features: Double-breasted closure, peak lapels, oversized fit, boxy silhouette
  9. Balmain Embellished Blazer:
  Brand: Balmain
  Color: Light pink
  Fabric: Textured fabric with a tweed-like appearance
  Design features: Double-breasted closure, round neckline, embellishments (pearls, crystals, or beads) along the edges, tailored fit
  10. Khaite Black Mini Skirt:
  Brand: Khaite
  Color: Black
  Fabric: Unable to determine from the video
  Design features: High-waisted, A-line silhouette, short length
  11. Givenchy Black Satin Shorts:
  Brand: Givenchy
  Color: Black
  Fabric: Smooth, shiny satin fabric
  Design features: High-waisted, tailored fit, slight flare at the leg opening, front zipper closure
  12. Reformation Black Ribbed Tank Top:
  Brand: Reformation
  Color: Black
  Fabric: Ribbed knit fabric (likely cotton or a cotton blend)
  Design features: High neckline, sleeveless
  13. Sergio Rossi Black Platform Loafers:
  Brand: Sergio Rossi
  Color: Black
  Material: Leather or faux leather upper
  Design features: Loafer style, chunky block heel, platform sole
  14. Gianvito Rossi Black Knee-High Boots:
  Brand: Gianvito Rossi
  Color: Black
  Material: Leather or faux leather upper
  Design features: Pointed toe, stiletto heel, knee-high length, slim fit
  15. J.W. Anderson Gold Sculptural Heel Boots:
  Brand: J.W. Anderson
  Color: Gold
  Material: Metallic leather or similar material
  Design features: Sculptural, artistic heel, pointed toe, slouchy or ruched shaf
  
  Detailed Description of Jewelry Items:
  Ruby Necklace (Fine Jewelry): A delicate silver chain necklace featuring a central oval-shaped ruby. The ruby is surrounded by a halo of smaller, clear gemstones, possibly diamonds or cubic zirconia, adding sparkle and enhancing the central ruby. The chain appears to be a snake chain, known for its smooth and sleek appearance.
  Pearl Necklace: A classic single-strand pearl necklace composed of creamy white pearls that are relatively uniform in size and shape. The pearls have a subtle luster, indicating good quality. The necklace fastens with a gold clasp, suggesting it might be 14k gold or gold-plated. The length is described as short, likely falling just below the collarbone.
  Vintage Lanvin Crystal Necklace with Ribbon Bow Tie: A statement piece featuring large, faceted smoky quartz crystals with a dark grey hue. The crystals appear to be irregularly shaped, adding to the vintage charm. They are strung together and connected with black cording, creating a visually interesting contrast. The necklace is further adorned with a black ribbon that can be tied into a bow, adding a touch of elegance and femininity. The metal components, likely the clasp and the loops connecting the ribbon, seem to have an antique silver finish.
  Givenchy Gold and Rhinestone Choker Necklace: A multi-layered choker necklace crafted from gold-toned metal chains of varying styles and thicknesses. The chains are embellished with clear rhinestones of different sizes, adding glamour and shine. The necklace appears to have a lobster clasp closure, ensuring secure wear. The combination of chain styles and rhinestone embellishments give this piece a bold and textured look.
  YSL Silver Chain Choker Necklace: Similar in style to the Givenchy necklace but made entirely of silver-toned metal chains. The chains vary in style and thickness, creating a layered and textured effect. The clasp is likely a lobster clasp, a common and secure closure for this type of necklace. The monochromatic silver design offers a sleek and modern aesthetic.
  Simple Gold Necklace: A short, classic gold necklace with a flat, linked design. The links have a subtle, woven pattern, adding visual interest without being overly ornate. The clasp is not clearly visible but is likely a spring ring or lobster clasp, typical for gold necklaces. The simplicity of this necklace makes it versatile and suitable for everyday wear.
  Fendi Costume Jewelry Necklace: A gold-toned necklace featuring multiple strands of delicate chains cascading down from a central decorative element. The central element showcases the Fendi logo and appears to be inspired by the brand's signature bag closures. The chains have a fine texture, possibly a cable or box chain, and the length falls somewhere between a choker and a princess length.
  Vintage Pendant Necklace: A long gold-toned necklace with a rectangular pendant. The pendant has a simple and clean design, featuring a single open space in the center, creating a geometric silhouette. The chain is fine and delicate, complementing the minimalist aesthetic of the pendant. The length of the necklace suggests it might be a lariat or opera length, offering a dramatic and elongated look.
  Custom Painted Pink Rolex Watch: A vintage Rolex watch with a unique custom paint job in a soft pink color. The watch face retains its original features, including hour markers, hands, and the Rolex logo. The band appears to be a grey leather strap with a textured finish, possibly alligator or crocodile skin, adding a touch of luxury and complementing the pink watch face.
  Gold Watch: A gold-toned watch resembling a Rolex in style but from an unidentified brand, possibly Citizen based on the glimpse of the logo. The watch features a gold-toned bracelet, likely a Jubilee or President style, known for their elegant and intricate link patterns. The watch face includes day and date complications, adding functionality to its classic design.
  Gold Cuff Bracelet: A wide cuff bracelet made from gold-toned metal. The design incorporates interlocking rectangular elements, creating a geometric and modern look. The bracelet appears to be open-ended, allowing for easy slip-on wear and adjustment to fit different wrist sizes. The polished finish of the gold gives the bracelet a sleek and contemporary feel.
  Vintage Rhinestone Bracelet: A vintage bracelet featuring rows of clear rhinestones set in a silver-toned metal framework. The rhinestones have a geometric, possibly square or rectangular, shape and are arranged in a symmetrical pattern. The bracelet appears to fasten with a fold-over clasp, a common closure for vintage pieces. The sparkle and shine of the rhinestones create a glamorous and eye-catching effect.
  Pearl Bracelet: A delicate bracelet made from small, lustrous pearls. The pearls are evenly matched in size and shape, strung together on a fine thread or cording. The bracelet has a gold-toned clasp, possibly featuring a small decorative element, such as a flower, as seen in the video. The simplicity and elegance of this bracelet make it suitable for both casual and formal occasions.
  Kathy Waterman Fine Jewelry Vine Bracelet: A fine jewelry bracelet crafted from silver-toned metal and featuring a delicate vine motif. Small pink gemstones, possibly pink sapphires or tourmalines, are set within the vine's leaves, adding a touch of color and femininity. The bracelet appears to have a secure clasp, possibly a lobster clasp or a box clasp with a safety latch. The intricate vine design and delicate gemstones create an elegant and refined piece.
  Black Frame Glasses: Classic black frame glasses with a large, rectangular shape. The frames appear to be made from a lightweight material, possibly acetate, and have a subtle shine. The lenses are clear, indicating their use as reading glasses or for vision correction. The simple and timeless design of these glasses makes them suitable for a variety of face shapes and personal styles.
  Gold Ray-Ban Reading Glasses: Gold-toned Ray-Ban reading glasses with a square shape and a double bridge design. The frames are thin and lightweight, and the earpieces have a subtle curve for comfortable wear. The lenses are clear, designed for reading or vision correction. The combination of the gold tone and square shape offers a sophisticated and slightly retro aesthetic.
  Gold Hoop Earrings (Large): Chunky gold hoop earrings with a thick tubular design. The hoops have a smooth and polished finish, reflecting light and adding a bold statement. The size of the hoops is approximately 2 inches in diameter, making them a noticeable and eye-catching accessory. The earrings likely have a post-and-butterfly closure, a common and secure fastening mechanism for hoop earrings.
  Jennifer Fisher Gold Huggie Hoop Earrings (Large): Large gold huggie hoop earrings with a thick and rounded design. The hoops have a smooth and polished finish, offering a sleek and modern look. The size is approximately 2 inches in diameter, providing a statement while maintaining a close fit to the earlobe. The earrings likely fasten with a hinged closure, a common feature of huggie hoops for ease of wear.
  Gold Hoop Earrings (Thin): Delicate gold hoop earrings with a thin and wire-like design. The hoops have a smooth and polished finish, offering a subtle and minimalist aesthetic. The size appears to be around 2 inches in diameter, similar to the larger hoops, but their thinness creates a more understated look. The earrings likely have a simple hook closure, allowing for easy wear and removal.
  YSL Gold Dangle Chain Earrings: Bold gold earrings featuring a chunky chain link design. Each earring consists of a series of interconnected elongated oval links, creating a dangling effect that adds movement and visual interest. The earrings are likely secured with post-and-butterfly closures, ensuring they stay in place while making a statement.
  Small Gold Hoop Earrings with Diamond Pavé: Small gold hoop earrings adorned with pavé-set diamonds. The hoops have a thin and delicate design, while the diamonds add sparkle and luxury. The earrings are clip-on style, making them accessible to individuals without pierced ears. The size is relatively small, creating a subtle and elegant touch.
  Vintage Gold Dangle Earrings: Vintage gold earrings with a unique and abstract design. Each earring features a long, tapered element with an open space near the top, creating a geometric and modern look. The earrings have a textured finish, possibly hammered or brushed, adding visual depth. They likely have post-and-butterfly closures for secure wear.
  Gold Square Hoop Earrings: Modern gold hoop earrings with a square shape. The hoops have a medium thickness and a smooth, polished finish, offering a contemporary and geometric look. The size is relatively small to medium, making them suitable for everyday wear. They likely fasten with hinge closures for ease of use.
  Vintage Gold Clip-on Earrings: Rectangular gold clip-on earrings with a minimalist design. The earrings have a flat surface and a smooth, polished finish. Their vintage style and clip-on mechanism make them a unique and versatile accessory for those who prefer or require non-pierced options.
  Jennifer Fisher Gold Huggie Hoop Earrings (Small): Small gold huggie hoop earrings with a thick and rounded design, similar to the larger version but in a more understated size. The hoops have a smooth and polished finish, providing a classic and versatile look. The size is approximately half an inch in diameter, making them suitable for everyday wear or for those who prefer smaller earrings. They likely fasten with a hinged closure for convenience and security.
  Simple Diamond Stud Earrings: Classic diamond stud earrings featuring a single, round brilliant-cut diamond in each earring. The diamonds appear to be set in a simple prong setting, allowing for maximum light exposure and sparkle. The earrings are likely secured with butterfly backings for a secure and comfortable fit. Their simplicity and elegance make them a timeless and versatile choice for any occasion.
  Delicate Gold Thread-Through Earrings: Minimalist gold earrings with a thread-through design. Each earring consists of a thin chain with a small bar or bead at the end that is designed to be threaded through the ear piercing and hang down the back of the lobe. The chain might have tiny beads or stations for added detail. The delicate nature of these earrings creates a subtle and unique look.
  Vintage Jade Ring: A vintage ring featuring a smooth, oval-shaped jade stone in a light green color. The jade stone is set in a gold-toned band with a rope-like texture, adding a touch of detail. Two small, clear gemstones, possibly diamonds, are set on either side of the jade, enhancing its beauty. The ring has a classic and elegant appearance, showcasing the natural beauty of the jade stone.
  Silver Ring with Purple Stone: A silver ring featuring a rectangular-shaped purple gemstone, possibly amethyst. The gemstone has a faceted cut, enhancing its color and brilliance. The ring's band is simple and sleek, allowing the purple stone to be the focal point. The combination of silver and purple creates a stylish and sophisticated look.
  Cartier Love Ring: A classic Cartier Love ring in gold. The ring features the iconic screw motif and is designed to be worn as a symbol of love and commitment. The ring has a smooth and polished finish, and the screw details add a touch of edginess to its elegant design.
  Costume Jewelry Ring: A chunky gold-toned ring with a large square-shaped face. The face of the ring is decorated with an embossed rose design and a small red gemstone in the center, possibly a ruby. The ring has a bold and statement-making appearance, adding a touch of vintage flair to any outfit.
  Stackable Black Diamond Rings: A set of two stackable rings made from a dark metal, possibly oxidized silver or black gold. Each ring is adorned with a row of small, pavé-set black diamonds, adding a touch of sparkle and a modern edge. The rings have a thin and delicate design, making them perfect for stacking or wearing individually.`,
  profession: "",
  isLoading: false,
  error: null,
};

export const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    setExistingWardrobe: (state, action: PayloadAction<string>) => {
      state.existingWardrobe = action.payload;
    },
    setProfession: (state, action: PayloadAction<string>) => {
      state.profession = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setExistingWardrobe,
  setProfession,
  setLoading,
  setError,
} = userProfileSlice.actions;
export default userProfileSlice.reducer;
