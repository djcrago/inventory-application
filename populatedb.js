#! /usr/bin/env node

console.log(
  'This script populates some test items and categories to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/inventory_application?retryWrites=true&w=majority"'
);

const Item = require('./models/item');
const Category = require('./models/category');

const items = [];
const categories = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = process.env.MONGODB_URL;
main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createCategories();
  await createItems();
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// categories[0] will always be the Feeding category, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name) {
  const category = new Category({ name });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function itemCreate(
  index,
  name,
  description,
  category,
  price,
  number_in_stock
) {
  const item = new Item({
    name,
    description,
    category,
    price,
    number_in_stock,
  });

  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  console.log('Adding categories');
  await Promise.all([
    categoryCreate(0, 'Feeding'),
    categoryCreate(1, 'Diapering'),
    categoryCreate(2, 'Baby Gear'),
    categoryCreate(3, 'Nursery & Decor'),
    categoryCreate(4, 'Clothing'),
    categoryCreate(5, 'Playing'),
    categoryCreate(6, 'General'),
  ]);
}

async function createItems() {
  console.log('Adding items');
  await Promise.all([
    itemCreate(
      0,
      'Deluxe Nursing Pillow',
      "My Brest Friend Pillows stay securely in place and don't shift or slide. The wrap-around design secures the pillow to the body, helping to maintain ideal positioning for latch-on while preventing back and neck pain. The arm and elbow rests eliminate shoulder stress and there is even a convenient pocket for nursing supplies and other accessories. The firm, flat-front cushion and adjustable, silent-release strap eliminate any gap between you and your baby. This keeps your baby from rolling in or away during breastfeeding. Purchase includes pillow insert and one slipcover. The Deluxe Nursing Pillow is made from an extra-soft baby-plush fabric and features a double-featured strap with Velcro and silent-release buckle for easy, one-hand use.",
      [categories[0]],
      49.99,
      43
    ),
    itemCreate(
      1,
      'Organic Support Nusing Pillow',
      "This Boppy bundle comes with the Organic Bare Naked Feeding and Infant Support Pillow and the Boppy x Babylist Organic Nursing Pillow Cover. The cover print is exclusive to Babylist, so you'll only find it here. Organic Bare Naked Feeding and Infant Support Pillow - New parents often say a Nursing Pillow is one of their most-used items. The Boppy Bare Naked Feeding and Infant Support Pillow ergonomically supports you while nursing or bottle feeding. It also supports baby during supervised awake time throughout their first year of milestones: feeding (0+ months), propping (3+ months), tummy time (6+ months) and sitting (9+ months). Created by a parent, the pillow is designed with your comfort in mind. It's small enough to fit in a rocking chair while feeding, but large enough to give the lift you and baby need. You can place the pillow around your front or side waist to get the best support for your feeding style: cradle, cross cradle, football hold or bottle feeding. You can put the entire pillow in your washer (cold water, delicate cycle) and in your dryer (low heat). One trick for making sure the pillow keeps its shape in the dryer is to wrap a tennis ball in a pillowcase and add it into the dryer with the Boppy. The tennis ball will pummel the Boppy and knock the stuffing back into place. Boppy x Babylist Organic Nursing Pillow Cover - Made of 100% soft, organic cotton fabric, it comes in a beautiful print that's exclusive to Babylist. It zips on and off your pillow, and it's fully machine washable.",
      [categories[0]],
      64.99,
      80
    ),
    itemCreate(
      2,
      'Organic Cotton Muslin Burp Cloths (3 Pack)',
      "Organic muslin burp cloths are super soft against your baby's sensitive skin, with four absorbent layers to protect you and your baby from spit up, drool, and milk dribbles. Green Sprouts burp cloths are generously sized, which will save your clothes and keep your baby dry and comfy, yet they're more affordable than similar cloths from other companies. They start out soft and get softer with each wash. These are also available in multi-color packs.",
      [categories[0]],
      26.99,
      18
    ),
    itemCreate(
      3,
      'Steel Diaper Pail',
      "Made of steel, this award winner achieves maximum odor control. Easy to load, use, empty and clean, it's a nursery essential that's equipped with rubber seals to lock in odors as well as a damper mechanism for a smooth, hermetically sealed closure. Catering to the needs of today's parents, it accommodates any standard trash bag or reusable cloth liner for convenience and value. The pail is equipped with a childproof safety lock that keeps little hands from finding their way inside the pail, as well as an innovative sliding lid. The Herringbone and Terrazzo patterns are exclusive to Babylist, so you'll only find them here.",
      [categories[1]],
      79.99,
      47
    ),
    itemCreate(
      4,
      'Newborn Diaper and Wipes Starter Bundle',
      "The Newborn Bundle includes Coterie Diapers in both Newborn and Size 1, along with Coterie Wipes. Both the diaper and wipes are hypoallergenic, dermatologist-tested and pediatrician-approved. Coterie Diapers - Coterie diapers are cleaner, softer and designed to help baby enjoy more comfortable sleep. The absorbent core holds up to 70% more liquid, so baby stays drier longer, even overnight. They absorb faster and quickly wick moisture away from skin to minimize leaks, blowouts and the likelihood of diaper rash. Gentle on baby's skin and the Earth, the diapers are made with 25% plant-based materials from sustainably managed forests. They're also proven free from hundreds of potentially harmful chemicals and irritants (including fragrance, latex, rubber, dyes, alcohol, parabens, phthalates and chlorine bleaching). Coterie Wipes - These extra large wipes use a 99% purified water solution on 100% biodegradable, plant-based fibers. The wipes are strong, soft and larger than average for a more thorough clean. Note: Packaging may differ from photos, but product descriptions are accurate.",
      [categories[1]],
      130,
      7
    ),
    itemCreate(
      5,
      'Organic Diaper Balm',
      "This soothing balm is cruelty-free and formulated with 100% organic ingredients that's gentle on baby's skin and the earth. Use just a tad of the ointment-like balm on your baby's bottom to thinly coat the diaper area after each change or bath. It comes in a small container, but a little goes a long way. It's cloth diaper safe and won't build up in fabrics. Made with organic oils, herbal extracts and botanicals like calendula and beeswax, this diaper balm doubles as a non-sticky first aid salve for the whole family that helps heal all sorts of minor ailments including rashes, burns, cuts, scrapes and bug bites.",
      [categories[1]],
      11.69,
      41
    ),
    itemCreate(
      6,
      'Stroll & Go Car Seat Cover',
      "For colder climates, infant car seat covers protect your baby from the elements when you're out and about. Skip Hop's is easy to use with windproof, water-resistant fabric to block out cold and a universal fit that will work with most infant seats. Elastic edges to secure around the car seat, and the front flap rolls to the side or zips off to get your baby in and out. Install it once, and the cover can stay put until warmer weather arrives. The soft, plush collar snaps closed to frame your baby's face for extra warmth, or flips open to snap to the outer layer and let more air in.",
      [categories[2]],
      39.99,
      44
    ),
    itemCreate(
      7,
      'Linen Ring Sling',
      "Woven with 100% natural European linen, WildBird Ring Slings provide comfort, beauty and durability. They're made using all-natural, low-impact dyes that are kind to our planet and baby's sensitive skin. WildBird Ring Slings are fully adjustable and intended to be accessible to everyone. Standard (74”) fits most users, and Long (90”) is intended for plus-size or tall (6ft+) wearers. Wear your baby from newborn to toddler (up to 35 lbs). You can carry your little one on your front, hip, or back. With practice, they will become a necessity. Be sure to watch the video tutorials on their website! Spizella, Oaxaca and Nava are exclusive to Babylist, so you'll only find them here.",
      [categories[2]],
      68,
      4
    ),
    itemCreate(
      8,
      'Wrap Carrier',
      "Lightweight and buttery-soft, the Solly Baby Wrap carrier is made from certified TENCEL Modal fabric that ties around the body, creating a snug, womb-like environment for baby. Made with comfort in mind, the wrap distributes the weight evenly around your upper body, so it won't strain your shoulders and back. It also distributes baby's weight, so it doesn't put extra pressure on your little one's joints or spine and is hip-healthy certified. The Original size is one-size-fits-all for every wearer. Designed for the first year of baby's life, the Solly Baby Wrap can be used with newborns through 25 lbs. Extra care should be taken with babies smaller than 8 lbs to make sure air passageways are clear. The Solly Baby Wrap is simple to use and comes with a step-by-step tutorial, as well as the instructional videos below that walk you through safe babywearing techniques. TENCEL Modal is a soft knit fabric made from sustainable Austrian beechwood trees, plus environmentally friendly dyes. The wrap is machine washable and can be tumbled dry on low. Simple, clean design with self-enclosing pocket at the end of the wrap for easy storage. Black & Natural Stripe, Rhubarb, Clove and Heather Grey are Babylist exclusives, so you'll only find them here",
      [categories[2]],
      74,
      15
    ),
    itemCreate(
      9,
      'Mixx and Demi Grow Cupholder',
      "This cup holder easily snaps onto your Nuna Mixx or Nuna Demi Grow stroller to hold your drink or your little one's bottle as you stroll. It fits any model year of both strollers.",
      [categories[2]],
      25,
      2
    ),
    itemCreate(
      10,
      'DEMI Next Stroller',
      "This is the next generation of Nuna's popular premium stroller. It offers 25+ modes, allowing you to convert it from a single stroller to a double or twin and use the included rider board or sibling seat accessory (sold separately). The seat can face both ways and reclines with one hand, plus it has custom dual suspension for a smooth ride. More noteworthy features include the self-guiding MagneTech secure snap buckles that automatically lock into place, easily removable premium Merino wool insert for comfort and a water-repellent UPF 50+ Aire protect canopy. The included rider board gives your little one (up to 50 lbs) a fun way to join along. It attaches easily and flips into the stroller basket when not in use.",
      [categories[2]],
      950,
      1
    ),
    itemCreate(
      11,
      'Pipa Rx Infant Car Seat with Relx Base',
      "Nuna products are known for being well-made, simple and safe. Color-coded indicators (green means installation is complete; red tells you there's more to do) let you know when the base is connected correctly so you can travel with confidence. It's also easy to install without the base—handy for parents who often rideshare. This seat gets points for safety and comfort. It has side-impact protection and a base with a fold-down stability leg that wedges against the car floor. The leg absorbs collision forces in an accident and stabilizes your baby's ride the rest of the time (it's a locking 3-piece design that makes it a better fit for different types of cars and the middle seat). The base also has an anti-rebound panel that helps achieve a tight install and prevents extra motion. There's more: the steel-reinforced rigid latch has four positions for a better fit against your vehicle seat. The bubble-free, numbered recline means you can change positions as your baby grows without having to uninstall the base. The low-profile base also allows for easier loading of the car seat. The vehicle seat belt lockoff makes belt routing easy with the open belt path, and opens smoothly with the touch of a button. Natural belt angles for lap and shoulder belts accommodate more vehicles. Another parent favorite: the Sky drape pulls down smoothly and attaches quietly with magnets, creating a shelter that harbors baby from the elements, while the mesh window lets you check in. The canopy is UPF 50+ canopy with a flip-out eyeshade for added protection. The Pipa RX comes with a two-piece removable infant insert made from organic jersey and head support that customizes to baby's shape. All the materials used are flame resistant, but without any added fire retardant chemicals. Two more noteworthy details: buckle holders keep the buckle out of the way when you're putting in baby and the luxe leatherette handle adds a chic touch. An additional Relx Base can also be purchased for multiple vehicles. If you want to attach your infant car seat to a stroller, the PIPA is compatible with many popular stroller brands. You can connect it directly to the Nuna Demi Grow, MIXX, TAVO, PEPP (adapter included), or another option: the UPPAbabyVista and Cruz (2015 and newer models; do not use RumbleSeat) with an adapter (sold separately).",
      [categories[2]],
      495,
      19
    ),
    itemCreate(
      12,
      'Organic Infant Lounger',
      "The Snuggle Me Lounger is a unique lounging pad designed to hug your baby's full body. This snuggling sensation is highly effective at calming and comforting your baby when you need extra support. The Lounger is organic, sustainable and ethically made in the USA. Snuggle Me entrusts local Minnesota seamstresses and fillers with the crafting of each Snuggle Me Lounger. They're made with non-toxic fabrics and filled with washable polyester fiber fill. Even though you can use the Snuggle Me Organic without a cover (sold separately), it's super convenient to have one on hand—washing a cover is much easier than washing the entire lounger. It also reduces the amount of wear and number of times the lounger will need to be washed. As recommended by the AAP, never use any baby lounger as a sleep device and never use any baby lounger unsupervised. Use the Snuggle me Lounger for supervised lounging, tummy time or as a changing pad.",
      [categories[3]],
      109,
      86
    ),
    itemCreate(
      13,
      'The Travel Kit',
      'Simple and effective, Rohm is designed to mask noises anytime, anywhere. Take the soothing power of white noise on your next vacation, flight or weekend away to ensure quality sleep. White noise most closely resembles what baby hears in the womb, and it can work like magic to soothe little ones and lull them to sleep. Rohm offers three soothing sounds, bright white noise, deep white noise or gentle surf, in a volume that ranges from whisper-quiet to impressively robust. Compact and portable, Rohm fits in a carry-on bag or backpack. It comes with a lanyard for easy handling or hanging. It can also operate all night on a single charge. To recharge, just plug the provided USB cable into a 5VDC/1A USB power adapter. When used with its provided charging cable and recommended adapter, the Rohm will take approximately 4 hours to charge if the battery is fully depleted. The sound machine may take longer to reach a full charge if it is on and charging.',
      [categories[3]],
      40.99,
      33
    ),
    itemCreate(
      14,
      'Rest Go',
      "The Hatch Rest Go helps babies sleep anytime, anywhere. Clip this portable sound machine on your stroller, place it next to your travel crib or toss it into your diaper bag. It offers ten of their most soothing sounds (White Noise, Ocean, Rain, Water, Wind, Dryer, Fan, Rock-a-bye, Heartbeat and Hush) and two colors. Three easy buttons allow for quick control. No app, WiFi or Bluetooth required for use—just grab and go with a rechargeable battery that lasts all day and keeps playing while charging at night. More to love: it's drop proof and drool-friendly.",
      [categories[3]],
      34.99,
      20
    ),
    itemCreate(
      15,
      'Geometric Stacker Wooden Education Toy',
      'Great for building early shape, color and size differentiation skills, this Melissa & Doug Geometric Stacker features 21 rings, octagons and rectangles that can be slotted onto the three rods. They can also be stacked on top of each other or lined up to compare shapes, sizes and colors.',
      [categories[3], categories[5]],
      22.99,
      15
    ),
    itemCreate(
      16,
      '26 Piece Wooden Blocks Starter Set',
      'Blocks have been proven to help children foster a healthy imagination. They also help stimulate the natural learning process—through play, little ones discover shapes and quantities, spatial dimensions, physical laws and more. Not to mention hours of creative fun. This set comes with 26 pieces: six square blocks, ten rectangular blocks, four triangles, two bridges and four round columns. Good to know: Since 2010, HABA products have been PEFC certified—meaning they use timber from sustainable forestry in Germany. Their beech and birch wood comes from forests within 100 miles of the HABA production facility.',
      [categories[3], categories[5]],
      49.99,
      0
    ),
    itemCreate(
      17,
      'Stay on Baby Booties (2 Pack)',
      "These organic baby boots have a signature two-part closure system that remains secure and adjusts to fit as baby grows. The machine-washable organic-blend fabric is breathable, naturally antimicrobial, environmentally sustainable and gentle on baby's sensitive skin.",
      [categories[4]],
      32,
      25
    ),
    itemCreate(
      18,
      'Swaddle UP Original 1.0 TOG',
      "Swaddle UP has the distinction of being a zip-up swaddle that allows your baby to sleep with their arms up. This natural position gives your baby access to their hands for self-soothing (baby can suck on their fingers right through the fabric!), while the fabric “wings” protect little faces from fingernail scratches. Swaddling helps your baby feel more secure, calms their natural startle reflex and helps them stay asleep longer. Swaddles are also safer than loose blankets in the crib or bassinet. The Swaddle UP is incredibly easy to use: the zipper is quick and quiet (many other swaddles use Velcro), and it stays on all night without any breakouts. The two-way zipper allows for diaper changes without removing the swaddle. Parents also appreciate the super soft fabric: it's breathable and not too thick, to reduce the risk of overheating. The swaddle fits snugly, so no extra wrapping is needed. But unlike a traditional swaddle, the Swaddle UP is roomier around the hips, leaving space for your baby's legs to move freely and promoting long-term hip health.",
      [categories[4]],
      32.95,
      75
    ),
    itemCreate(
      19,
      'The Outfit 3 Piece Set',
      "The Head to Toe Set comes with a Short-Sleeve Bodysuit, Pants and a photo-ready finishing touch: accessorize with either the Knotted Hat or Bow Headband. All pieces are made from soft 100% GOTS-certified organic cotton that's gentle on baby's skin. What's inside: The Bodysuit features snaps along the bottom and lap shoulders for easy on and off (you can pull it over baby's head or down over their feet). Layer with pants or wear solo on warm days. The Pants are a comfy essential with faux wooden buttons for a stylish touch. The Knotted Hat is all about cozy softness, topped with a non-adjustable knot for an adorable finishing touch. The soft cotton Headband has a charming bow (non-adjustable). Tiny Kind is a sustainable brand that celebrates your tiny human with a dose of kindness to the earth. The clothing is crafted from 100% GOTS-certified organic cotton, plus the inks are organic and non-toxic. Boxes used by the factory are made from recycled fabric scraps converted into paper pulp. The end result: pieces you can feel good about—worthy of each big little moment.",
      [categories[4]],
      28,
      3
    ),
    itemCreate(
      20,
      'Essentials Cotton Muslin Swaddles (4 Pack)',
      "There is something so satisfying about wrapping your baby up in the perfect, comforting swaddle, and aden + anais's muslin blankets are the gold standard for this. The 100% cotton muslin fabric is super soft, lightweight, breathable and can be used in many climates. The blankets are pre-washed for softness, and get even softer with each wash. The loose, gauzy weave makes them equally great as stroller or nursing covers. Or they can be used as a changing table cover, burp cloth, tummy time blanket and more.",
      [categories[4]],
      39.99,
      10
    ),
    itemCreate(
      21,
      'Where the Wild Things Are',
      "This special commemorative edition celebrates 40 years of Sendak's classic tale of the imaginative journey taken by a boy named Max to “where the wild things are.”",
      [categories[5]],
      21.99,
      8
    ),
    itemCreate(
      22,
      'Love You Forever (Hardcover)',
      "First published in 1986, this classic book by Munsch is a gentle affirmation of the love a parent feels for their child—forever. McGraw's soft and colorful pastels perfectly complement the sentiment of the book. It's one that will be read repeatedly for years.",
      [categories[5]],
      14.95,
      1
    ),
    itemCreate(
      23,
      'Bouncer Bliss',
      "BabyBjorn's lightweight bouncer scores high marks with parents. The low-tech design relies on your baby's own movement to generate a natural rocking motion. It has a chic, modern profile, folds flat for easy transport and storage and best of all, no batteries are required. The bouncer sits low to the ground and creates an ergonomic little nest for infants. The fabric is stretched over a flexible framework that moves in response to your baby's movements, in contrast to swings that operate electronically. Choose from two fabric options: stretchy 3D Jersey, their softest and most velvety material, and 100% quilted cotton for a soft and snuggly feel. The seat distributes your baby's weight evenly (particularly important for newborns) and supports their head, neck and back. It has three recline positions and adjusts easily with one hand. The cover removes easily for machine washing (scoring more points), and when your baby gets bigger you can flip the cover over and use it as a toddler seat. You can buy an extra Bouncer Bliss fabric seat to have a spare for laundry day. Pro tip: you can upgrade a Bouncer Soft with the new fabrics, which fit on the original frames as well. All bouncer fabrics that come in contact with your little one's skin meet the requirements of OEKO-TEX Standard 100, Class 1 for baby products. This means that they're kind to your baby's skin and safe. Keep in mind: This product is not approved for sleep.",
      [categories[5], categories[2]],
      209.99,
      10
    ),
    itemCreate(
      24,
      'Play Gym and Sensory Strands Bundle',
      "Designed by child development experts, The Play Gym grows with your baby through a full year of play—from tummy time to sitting up and beyond. It's beautifully crafted with eco-friendly, durable and baby-safe materials. If you plan to have more than one child, this is a well-made piece that you can pass down through multiple children. Five development zones on The Play Gym reveal or conceal activities to prevent overstimulation and promote learning in targeted areas: focus, sound, tactility, hiding and finding and colors. The Play Gym comes with a system of interchangeable Card Sets that you can swap out for your baby, including clips that attach to The Play Gym legs so that cards can be used overhead. You can hang toys from the arches or cover them with the Play Space Cover to inspire imaginative play. You can also get an easy-to-scan Play Guide for parents with research-backed ideas for fun activities throughout the developmental stages of the first year. Lovevery Play Gym activities include: Organic Cotton High Contrast Montessori Ball is detachable and easy for your baby to grasp, pass from hand to hand or roll. Wooden Batting Ring designed for batting and grasping, with bell and castanet sounds. Organic Cotton Teether made with organic cotton, detachable and perfect for mouthing. Silicone teething rings manufactured without PVC for safe, comfortable teething. Black & White Card Set with high-contrast images that gradually get more complex. Mirror Card Set, Common Objects Card Set and Faces Card Set. The Play Guide: A full year of ideas for how to play. Card Set Clips that attach to the gym to hold and rotate Card Sets. The Play Gym sets up in just two minutes, with no tools or batteries required. This means you can easily travel with or stash it away. It also includes an easily attachable Play Space Cover that transform your child's play space. Sensory Strands - Thoughtfully designed by child development experts, Sensory Strands encourage cognitive and sensory exploration, motor skills and auditory and tactile stimulation—plus, they are a lot of fun. Babies find them irresistible. Made with responsibly sourced, baby-safe materials such as organic cotton, Sensory Strands attach easily to The Play Gym by Lovevery with Velcro straps and a safety loop.",
      [categories[5]],
      165,
      29
    ),
    itemCreate(
      25,
      'Pull Along Toy',
      'Made of durable natural wood, Hape Pull Along toys encourages walking, balance, fine motor skills and so much engaging fun.',
      [categories[5]],
      15,
      4
    ),
    itemCreate(
      26,
      'Goodnight Moon (Hardcover)',
      "In this classic of modern children's literature, beloved by generations of readers and listeners, the quiet poetry of the words and the gentle, lulling illustrations combine to make a perfect book for the end of the day.",
      [categories[6], categories[5]],
      21.99,
      0
    ),
    itemCreate(
      27,
      'If You Give a Mouse a Cookie',
      "“If you give a mouse a cookie, he's going to ask for a glass of milk. When you give him the milk, he'll probably ask you for a straw. . . “. So begins this delightful story about an energetic mouse and an accommodating little boy.",
      [categories[6], categories[5]],
      19.99,
      2
    ),
    itemCreate(
      28,
      'Wearable Blanket 0.3 TIG',
      'Wearable blankets keep baby warm and are a much safer option than loose blankets in the crib. Designed to be worn over pajamas, this Wearable Blanket from Tiny Kind has a two-way zipper (which allows you to change baby without fully undressing them) and a 0.3 TOG rating, ideal for warmer climates or rooms. Tiny Kind is a sustainable brand that celebrates your tiny human with a dose of kindness to the earth. The clothing is crafted from 100% GOTS-certified organic cotton, plus the inks are organic and non-toxic. Boxes used by the factory are made from recycled fabric scraps converted into paper pulp. The end result: pieces you can feel good about—worthy of each big little moment.',
      [categories[6]],
      26,
      0
    ),
    itemCreate(
      29,
      'Drawer Dividers',
      'Drawer Dividers help keep little clothes and accessories organized and visible in the drawer (think tiny socks!). Adjust the drawer divider to the desired length (11” to 17”), and place it in the drawer—no tools needed. Soft grips on the edges keep the dividers in place. Sprucely is a Babylist-exclusive brand offering essential functional products designed to simplify everyday moments with baby, from car rides to bottle cleaning and diaper changes to clothing storage.',
      [categories[6]],
      21.99,
      3
    ),
    itemCreate(
      30,
      'Fast Table Chair',
      "Baby chairs that attach directly to the edge of the table are great because they put your little one right in the middle of the action instead of being slightly separated in a high chair. Highly portable and easy to use, Inglesina's Fast chair attaches to the edge of the table to provide a safe seat for your child whether you're at home or away. This lightweight chair uses twist-couplings to fasten to the table without scratching it, and it will work with most tables. The washable, padded seat is comfortable, with nice details like a high back rest and fabric coverings over the buckle and frame. There's a pocket in the back to stash a bib, and an integrated carrying bag (note: the chair will arrive inside the carry bag). The chair is a cinch to take with you when you're on the road or heading to a restaurant. Inglesina also makes a dining tray custom-fit for the Fast chair for a clean (and easy to clean) surface for your baby.",
      [categories[6]],
      89,
      21
    ),
    itemCreate(
      31,
      'Silicone & Wood Multi-Ring Teether',
      'The beautiful Multi-Ring Teether from AEIOU pairs natural beech wood rings with food-grade silicone beads, offering babies varied textures to discover and chew. The soft silicone and wood combo provides soothing relief for sensitive gums and emerging teeth. AEIOU is a Babylist-exclusive brand that supports an early connection around meals and food to last a lifetime, along with safe soothing essentials',
      [categories[6], categories[2]],
      20,
      1
    ),
    itemCreate(
      32,
      '3-Piece Brush Set',
      "This Kyte Baby Brush Set comes with a hairbrush with natural goat hair bristles, a hairbrush with wooden bristles and a bamboo baby comb. Brushing with super soft natural goat hair bristles is recommended for newborn scalps, especially soft spots. It also helps to reduce pesky cradle cap. The brush with wooden bristles safely massages baby's scalp and is equally great for toddler hair. All Kyte Baby products are ethically and responsibly made with bamboo, one of the most sustainable resources in the world.",
      [categories[6]],
      26,
      14
    ),
    itemCreate(
      33,
      'All Aboard! National Parks: A Wildlife Primer (Lucy Darling)',
      'This new board book series written by the husband and wife team of Haily and Kevin Meyers and illustrated by Haily, celebrates the unique qualities of each city while employing a fun primer element to tell the story. These books will have you and baby seeing the world by train and will turn story time into a globetrotting event. Perfect as a souvenir or as part of a geography collection for brilliant babies, the All Aboard! series will be pulling into your station next!',
      [categories[6], categories[5]],
      8.91,
      18
    ),
    itemCreate(
      34,
      'The Going To Bed Book',
      'This classic bedtime story is just right for winding down the day as a joyful, silly group of animals scrub scrub scrub in the tub, brush and brush and brush their teeth, and finally rock and rock and rock to sleep. The day is done. They say good night, and somebody turns off the light.',
      [categories[6], categories[5]],
      5.02,
      18
    ),
    itemCreate(
      35,
      'Pound and Tap Bench',
      "Pounding sends the balls tinkling over the xylophone, or your little one can pull out the keyboard to play the xylophone solo. The Pound and Tap Bench helps develop fine motor skills by promoting dexterity, hand-eye coordination, manipulation and cause and effect. Durable and child safe, it's made of natural wood and water-based paint with non-toxic finishes.",
      [categories[6], categories[5]],
      32.99,
      1
    ),
  ]);
}
