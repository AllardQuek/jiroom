import { getStoreKeys } from "@/lib/utils/localStorage";
import type { Listing, Viewing } from "@/types/listing";
import type { Evaluation, Template } from "@/types/evaluation";
import type { Verdict } from "@/types/verdict";
import type { Anchor } from "@/types/anchor";

const now = new Date("2026-06-08T10:00:00+08:00").toISOString();
const daysAgo = (n: number) =>
  new Date(Date.now() - n * 86400000).toISOString();
const daysFromNow = (n: number) =>
  new Date(Date.now() + n * 86400000).toISOString();
const yearsAgo = (n: number) => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - n);
  return d.toISOString();
};
const yearsFromNow = (n: number) => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + n);
  return d.toISOString();
};

export const seedListings: Listing[] = [
  {
    "id": "838cdfe9-1613-42da-ac14-9c6d207e3029",
    "source_url": "https://www.propertyguru.com.sg/l/60023485",
    "title": "Simei Street 3, Eastpoint Green",
    "price": 750,
    "area": "Simei",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "lat": 1.3393621,
    "lng": 103.95067259999999,
    "googlePlaceId": "ChIJqxXxoiQ92jERTdFEeiX-vjU",
    "notes": "",
    "created_at": "2026-06-17T04:16:14.430Z",
    "updated_at": "2026-07-16T12:49:34.590Z",
    "is_taken": false
  },
  {
    "id": "46c77228-a0f9-427d-a94b-0510f1e08e73",
    "source_url": "https://www.propertyguru.com.sg/l/500163996",
    "title": "52 Tanah Merah Kechil Road",
    "price": 1000,
    "area": "Tanah Merah",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "lat": 1.329871,
    "lng": 103.943652,
    "googlePlaceId": "ChIJV7Lu9jM92jER5bYPjtCG6t8",
    "notes": "- newly renovated, 2 rooms one with window facing out, other with high indoor window\n- shower need to wear slippers out bit troublesome\n- have a common area with super high ceiling but no fan\n- Landlord said this room if 900 excluded utilities.  1000 then utilities included\n\n-- \n- The other room 1000. If you really interested, I try 950 for you\n- He said. 950 ok. Utilities capped $400.\n- After landlord signed.  Need to pay 1 month deposit.  1month advance rent\nDear Tenant,\n\nKindly Bank in the rent or deposit to our company account as follows:\n\nCompany Name: Co-Living APP Pte. Ltd.\nBank : OCBC Bank\nAccount No: 701838062001\nPaynow UEN: 202135892C\nSwift Code : OCBCSGSG\nBank Code. : 7339\n\nPlease indicate your House and Room number in the payment remarks. Thanks 🙏\n\n---\n\n 1.⁠ ⁠Contact end 1 day before. \n 2.⁠ ⁠Can. You need to inform 1 month before. If you never inform. It becomes automatic renew. \n 3.⁠ ⁠Landlord will not be able to know if anything is damaged  , so deposit will be returned within 14 days.\n 4.⁠ ⁠Its up to you , want to change anot, but if any government sector come and check and your address in your ic is not same as contact,  you need to explain to government yourself why you never change.\n 5.⁠ ⁠Deposit is to offset any damage to the item you damaged,  and if you breaking the contract of leaving earlier, and no replacement,  cannot be Landlord bearing the cost, of cause you can't take back your deposit, this is normal practice. You leave before contract end, deposit will be forfeited, and you have to pay 1 more month rental as you never inform landlord, you can take back deposit if you can find someone to take over you. But fee apply to do new contract. \n 6.⁠ ⁠If you lost your key of your room door, or main gate . You cant enter, and need them to go over to open door, charges apply. \n 7.⁠ ⁠That is a landed house, only key. \n 8.⁠ ⁠Only items in the room tenant need to bear, unless it wear and tear. Everything in the room are new, if its damaged you have to bear all costs.\n---\n5.⁠ ⁠If you can find replacement if you want to leave before the 6months, if you can find, only need to pay for doing a new contract ,if need me or landlord find, extra charges. If cant find, need to pay 1 more month and deposit forfeited.\n\n The company has no bank account at the moment.  So has to transfer to another of landlord's company account.  If you dont want, you can pay cash. Some tenants dont know how to paynow to uen.\n---\n- bad reviews of landlord\n- agents says This is the 1st time the the landlord ask me to find tenant\n- I cant tell you if the comments are real or not, or someone leave fake comments",
    "created_at": "2026-06-18T14:10:01.868Z",
    "updated_at": "2026-07-05T11:21:48.865Z",
    "is_taken": false,
    "negotiated_price": 950
  },
  {
    "id": "4e3368ec-761b-45b2-b999-5fd184e42744",
    "source_url": "https://www.propertyguru.com.sg/listing/hdb-for-rent-522b-tampines-central-7-23896431",
    "title": "522b Tampines Central 7",
    "price": 880,
    "area": "Tampines",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "lat": 1.3577995999999999,
    "lng": 103.93886339999999,
    "googlePlaceId": "ChIJN3gBuQw92jERUlbN8wBlEL8",
    "created_at": "2026-06-14T10:03:58.892Z",
    "notes": "- cheap, 2 single beds or 1 queen bed\n- landlord friendly\n- start only on 7/7, but landlord could get the other guy to move or something, just a bit troublesome\n- lowest 850\n- too rush as agent overseas and need scan passes",
    "updated_at": "2026-06-28T13:35:12.190Z",
    "is_taken": false,
    "negotiated_price": 850
  },
  {
    "id": "2e658503-4183-4b6b-b2e8-36daf765b333",
    "source_url": "https://www.propertyguru.com.sg/listing/for-rent-casa-merah-500048407",
    "title": " Casa Merah (CK)",
    "price": 1000,
    "area": "Tanah Merah",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "lat": 1.3293736,
    "lng": 103.946236,
    "googlePlaceId": "ChIJjwdQyjM92jERY7ZOcgo4woc",
    "created_at": "2026-06-14T09:57:55.218Z",
    "notes": "- 52 casa merah ground floor, high ceiling\n- tall window, maybe more height to stack\n- 5 common share 2\n- can try for 1k\n- Earliest handover will be 29Jun evening\n\n—\n\n21 June Call\n- 6 month lease preferred\n- another room, with balcony but only portable aircon\n- portable a/c noisy and may not be effective\n\n- For the $950 (subject to landlord agreement), the profile currently: \nMBR - Indonesian Male Professional\nCR1 - Chinese Male Professional\nCR2 - \nCR3 - Vietnamese male \nPR1 - Malaysian Female\nPR2 - empty\n\n- No they won’t reinstate that aircon\n- Anyways , the existing tenant stayed here and extended for additional 3 months knowing and stayed with the portable aircon. No change in rental price at $1080 ya.\n- I have spoken to the landlord and they indicate that someone is keen and will get back to me soon\n\n---\n\n- Hi CK, thanks for the call. The lowest we can go is at $950 for this room and we have someone who came yesterday and quite keen. She is waiting for her IPA which will be out next week.\n- Please inform tenant, it will be based on first come first serve. Thanks\n- CK didn't get back on portable aircon sleep mode + remote control\n- Haven't handover but other people already put in deposit\n- No updates on handover date/timing\n\nOffer: $950 CR2 at CM54 #01-12 \nLease from 27 Jun 2026 for 6 months \n\nDeposit: 1 month \nStamp duty: $22 + $10 admin fee",
    "updated_at": "2026-06-28T13:34:27.667Z",
    "is_taken": true,
    "negotiated_price": 950,
    "taken_date": "2026-06-25T16:00:00.000Z"
  },
  {
    "id": "0a026350-d2dc-4c3f-b08b-8ab7723ab7a5",
    "source_url": "https://www.propertyguru.com.sg/listing/for-rent-casa-merah-25616489",
    "title": "Casa Merah (Kenneth Ma)",
    "price": 960,
    "area": "Tanah Merah",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "lat": 1.3293736,
    "lng": 103.946236,
    "googlePlaceId": "ChIJjwdQyjM92jERY7ZOcgo4woc",
    "created_at": "2026-06-14T09:44:41.250Z",
    "notes": "- seems like real wall, no external window\n- maybe 8 pax, but nice tenants\n- 2nd floor\n\nIncluded in the rent\n1. PUB(water gas electricity) up to $400\nExcess amount divide equally among all tenants\n2. Wifi\n3. Weekly cleaning to common area and room\n4. Aircon servicing\n5. Wear & tear maintenance\n\nOne time payment fee\n1. Admin and move out cleaning fee - $87.20\n2. Stamp duty fee - 0.4% of total rent\n\nNo heavy cooking - keep place clean and not oily. (Tenants to inform me if dirty)\n\n-- \n- Utilities usually don’t exceed, If exceed is about 10 dollars\n- Foreigners - Myanmar, Chinese, Indian \nAll working\n- Looking at 1 year only sorry",
    "updated_at": "2026-06-28T13:28:28.576Z",
    "is_taken": false,
    "negotiated_price": 900
  },
  {
    "id": "6cbba1e2-b663-40f7-b441-3f9bc6dfccb8",
    "source_url": "https://www.propertyguru.com.sg/l/500120557",
    "title": "Tampines Street 42, Block 451",
    "price": 888,
    "area": "Tampines",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "lat": 1.356598,
    "lng": 103.9540153,
    "googlePlaceId": "ChIJQ13iYwQ92jERYyJ3YDwNwq4",
    "notes": "- right at mrt but no food nearby\n-  no supermarket nearby\n\n\n- basically it's just a guide to not exceed 8 hours of usage. If you don't use that much, all the better for aunty.\n- correct spelling. basically this clause means \"in the event of a break lease (where tenant terminates pre-maturely) the tenant will be required to reimburse the landlord for the unexpired portion of the upfront property agent commission\". This pro-rata refund is calculated based on the unfulfilled months of the lease term.\n- 1 month will be a fair notice period to give for both sides.\n- Landlord rep comm: Lease term of 1 year and below, is half month rent + GST\n- As conveyed earlier A/C servicing for the room aircon will be borne by the Tenant. Aunty will arrange and you just need to pay her directly thanks!",
    "is_taken": false,
    "created_at": "2026-06-24T10:22:11.850Z",
    "updated_at": "2026-06-28T13:27:06.701Z",
    "negotiated_price": 850
  },
  {
    "id": "164fe9fe-0835-412b-9bfe-1d5a393ec56b",
    "source_url": "https://carousell.app.link/qDPrwQGB73b",
    "title": "Eden at Tampines",
    "price": 950,
    "area": "Tampines",
    "source_platform": "Carousell",
    "status": "viewed",
    "lat": 1.3554952999999998,
    "lng": 103.9597709,
    "googlePlaceId": "ChIJfQA_rcw92jERoTQXOhBuWDc",
    "notes": "- lease min 6 months \n- side gate leads straight to Tampines mart\n\n1. If total household utilities exceed $450 per month, extra cost will be split equally among all tenants.\n2. ⁠Yes, + every 3 mths AC servicing of $40\n3. ⁠We only take working professionals / students, don’t have to worry. \n4. ⁠no, it will be as is (i.e. no partition for shower and toilet)",
    "created_at": "2026-06-21T08:03:03.502Z",
    "updated_at": "2026-06-26T05:23:41.104Z",
    "is_taken": true,
    "taken_date": "2026-06-26T05:23:27.236Z"
  },
  {
    "id": "fe50fa9b-a5a3-40be-bb5a-1ec7f1790b40",
    "source_url": "https://www.propertyguru.com.sg/l/500177332",
    "title": "Bedok North Road, Block 119",
    "price": 800,
    "area": "Tanah Merah",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "lat": 1.3301771999999998,
    "lng": 103.93864099999999,
    "googlePlaceId": "ChIJ0yLu5DU92jERM43gl6kfL28",
    "notes": "- need to buy furniture like table, bed",
    "created_at": "2026-06-22T10:42:00.225Z",
    "updated_at": "2026-06-26T02:05:25.490Z",
    "is_taken": false
  },
  {
    "id": "e22ff42b-99ee-449a-8fd2-f470d02ea4c9",
    "source_url": "https://www.propertyguru.com.sg/l/500168882",
    "title": "Tampines Central 7, Block 515D HDB Tampines",
    "price": 850,
    "area": "Tampines",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "lat": 1.3568947999999998,
    "lng": 103.9392777,
    "googlePlaceId": "ChIJgUSxWQA92jER2vRXZ9BrjoI",
    "notes": "- nearby food a bit ex\n- no dryer\n- room is nice, enough space, big windows\n- but aircon only 10pm-530am, not flexible\n- fridge may not have much space",
    "created_at": "2026-06-15T09:51:54.829Z",
    "updated_at": "2026-06-23T17:37:14.183Z",
    "is_taken": true,
    "taken_date": "2026-06-19T00:00:00.000Z"
  },
  {
    "id": "2ba4f255-9581-49cd-982f-d15ed7c49be2",
    "source_url": "https://www.propertyguru.com.sg/listing/for-rent-modena-25421062",
    "title": "Simei Street 4, Modena",
    "price": 1090,
    "area": "Simei",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "lat": 1.3425186999999998,
    "lng": 103.95455369999999,
    "googlePlaceId": "ChIJ7fOogCE92jERRVRY-XPZzVk",
    "created_at": "2026-06-13T18:00:39.677Z",
    "notes": "- decent size, though single bed\n- side gate directly to mrt\n- gym decent size, facilities look new\n\n📌 Room Breakdown \n\n • Security Deposit: one month rent equivalent ($1090) \n\n- Monthly Room Rent + Maintenance Fee: $1090+60( to be paid on move in day)\n\nTo be paid after tenancy agreement is signed:\n • Admin Fee (one-time): $50+9%=$54.50 \n • Exit Cleaning Fee (one-time): $30+9%=$32.70 \n • Stamp Duty: Based on lease duration (IRAS calculation)\n\n⸻\n\n📌 Maintenance Fee ($60)\n- covers aircon servicing and chemical wash\n- minor repair for fair wear and tear(negligence not covered)\n\n⸻\n\n📌 Utilities\n • Landlord covers up to $400/month for utilities\n • If utilities exceed $400, the excess will be split equally among all tenants\n\n⸻\n\n🏠 What’s Included & House Rules\n\n✅ Fully furnished — bed, wardrobe, table, chair, aircon\n✅ Utilities($400), aircon servicing, WiFi included\n✅ Weekly cleaning of common areas and room (room cleaning if cleaning tag is hung on door)\n✅ Light cooking allowed\n✅ Visitors only allowed before 10 PM (no overnight guests)\n✅ Strictly no smoking — clean, smoke-free environment\n✅ No pets allowed",
    "updated_at": "2026-06-23T13:36:45.506Z",
    "is_taken": false
  },
  {
    "id": "784c786b-860b-40e9-b367-cf69b0dc8cdc",
    "source_url": "https://www.propertyguru.com.sg/l/60039798",
    "title": "Tampines Avenue 4, Block 809",
    "price": 999,
    "area": "Tampines",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "lat": 1.3461404,
    "lng": 103.93649429999999,
    "googlePlaceId": "ChIJ7dAWwWo92jERY7LtJmVySbA",
    "notes": "- huge room, maybe too big\n- stay with malaysian lady and landlady\n- no dryer\n- aircon fixed at night only\n- no kettle\n- queen size bed",
    "created_at": "2026-06-15T09:51:01.588Z",
    "updated_at": "2026-06-23T01:02:28.742Z",
    "is_taken": true,
    "taken_date": "2026-06-23T01:02:27.933Z"
  },
  {
    "id": "c92e2521-5499-47f7-9870-59101704c8d8",
    "source_url": "https://www.propertyguru.com.sg/listing/hdb-for-rent-183-bedok-north-road-25131595",
    "title": "Bedok North Road, Block 183",
    "price": 1000,
    "area": "Tanah Merah",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "lat": 1.3264240999999999,
    "lng": 103.9418434,
    "googlePlaceId": "ChIJ556LyDQ92jER38R5sIRD0v0",
    "created_at": "2026-06-14T09:41:56.248Z",
    "notes": "- owner likes to separate stuff, will provide mini fridge\n- slightly smaller room would need table\n- room may be hot without aircon\n- Actually landlord is looking at $1k without utilities and dryer usage included\n- Unfortunately probably not. 900 he will probably only accept no fridge usage and no washer usage too",
    "updated_at": "2026-06-21T12:26:58.027Z",
    "is_taken": false
  },
  {
    "id": "3e3b333f-9a1a-4d23-b925-9e666a76e9c2",
    "source_url": "https://www.propertyguru.com.sg/l/60085853",
    "title": "417 Tampines Street 41",
    "price": 850,
    "area": "Tampines",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "lat": 1.3588004,
    "lng": 103.94728429999999,
    "googlePlaceId": "ChIJs4TXzAg92jERF00h5woKMI4",
    "notes": "",
    "created_at": "2026-06-21T11:36:06.440Z",
    "updated_at": "2026-06-21T12:25:39.262Z",
    "is_taken": false
  },
  {
    "id": "1c4d6959-f428-42c5-b19e-ff85dc3c6e7f",
    "source_url": "https://www.propertyguru.com.sg/l/500174210",
    "title": "Simei Street 3, Eastpoint Green",
    "price": 1000,
    "area": "Simei",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "lat": 1.3393621,
    "lng": 103.95067259999999,
    "googlePlaceId": "ChIJqxXxoiQ92jERTdFEeiX-vjU",
    "notes": "- space too small\n- fake window alr $1k\n- pool facing but small room $1.2k",
    "created_at": "2026-06-21T10:11:04.193Z",
    "updated_at": "2026-06-21T12:25:10.742Z",
    "is_taken": false
  },
  {
    "id": "5d75fd1e-8c9d-44d9-82e4-8738a917c5c7",
    "source_url": "https://www.propertyguru.com.sg/l/25113117",
    "title": "Simei Street 3, Eastpoint Green",
    "price": 880,
    "area": "Simei",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "created_at": "2026-06-08T01:31:46.340Z",
    "lat": 1.3393621,
    "lng": 103.95067259999999,
    "googlePlaceId": "ChIJqxXxoiQ92jERTdFEeiX-vjU",
    "notes": "- pretty good with window but small\n- small table right beside bed, no space for chair, maybe not for luggage\n- agent cant communicate, dont trust, didnt even bother informing block and room number\n- bus from CGH to simei\n\n---\nALL LISTINGS\n08-20\nR5\nhttps://drive.google.com/file/d/1cYEorryMl_gzsAVVSfUgkAKIPlv6Snfc/view?usp=drivesdk\n$880\n\n04-10\nR2\nhttps://drive.google.com/file/d/1AWS6lS8HpdySRQ7LLSVRa9nTxfUokawp/view?usp=drivesdk\n$1250\n\n05-23\nR4\nhttps://drive.google.com/file/d/12lo68MiBcqpOuYPshBkM1xUc23TsPb_x/view?usp=drivesdk\n$1300\n\n04-14\n\nR2\nhttps://drive.google.com/file/d/1nnSMEsmoY7uh99JGYE8JsZtB4VRb26bd/view?usp=drivesdk\n$1500\n\nR4\nhttps://drive.google.com/file/d/1nZipX8WjP3e0rlFB-kz1Ocdodd62sipj/view?usp=sharing\n$1200\n\n05-15\nhttps://drive.google.com/file/d/1qYbzLWdOq3rUYjnDEhsPg4gpWuzN8MXU/view?usp=drivesdk\n$1488\n\n02-08\nMaster room\nhttps://drive.google.com/file/d/145Jv9L95YyNyZmTFKM8L4mpeK70v-KiI/view?usp=drivesdk\n$1800\n\n05-14\nR5\nhttps://drive.google.com/file/d/1SESVmFcQ8Cq52SLtH0Cxps2dNb82JfBR/view?usp=drivesdk\n$950\n\n04-19\nMaster room\nhttps://drive.google.com/file/d/1C5dyFN7AqjEra2JaZ4u7nq8PozXZCOhA/view?usp=drivesdk\n$1800\n\nR2\nhttps://drive.google.com/file/d/1eju6QW8tt7CWWs6fSo0OUgscxqmPu5Ug/view?usp=drivesd&\n$1250\n\n03-03 \nRoom 3\nhttps://drive.google.com/file/d/1s3u5iFRMWHyYeRkh8FpS5OyobmC6N6U8/view?usp=drivesdk\n\n\nRoom 5\nhttps://drive.google.com/file/d/1vUE10Y5CPguFLwLRx0_9k_cldtQA2f4x/view?usp=drivesdk\n\n05-03\nMaster room\nhttps://drive.google.com/file/d/16jX_wxDBuYifm1c4AaAUwbtOYNID6nJu/view?usp=sharing\n(Available 30 June)",
    "updated_at": "2026-06-21T10:10:10.903Z",
    "is_taken": false
  },
  {
    "id": "2cdc97ca-28b1-492d-a4cd-5c3165d561d3",
    "source_url": "https://www.propertyguru.com.sg/listing/hdb-for-rent-252-tampines-street-21-500012144",
    "title": "Tampines Street 21, Block 252",
    "price": 1000,
    "area": "Tampines",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "lat": 1.3525823,
    "lng": 103.9489483,
    "googlePlaceId": "ChIJ5cRQdBA92jER0WbhY_RC99I",
    "created_at": "2026-06-14T03:48:09.977Z",
    "notes": "- 2 rooms available, can move in early\n- aircon 8 hours but can be flexible",
    "updated_at": "2026-06-20T11:37:28.876Z",
    "is_taken": false
  },
  {
    "id": "abd7c50d-4588-4a9e-ba79-48a2325e2843",
    "source_url": "https://www.propertyguru.com.sg/listing/for-rent-the-springfield-500146958",
    "title": "The Springfield, Chempaka Kuning Link",
    "price": 1100,
    "area": "Tanah Merah",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "lat": 1.3322659,
    "lng": 103.9495918,
    "googlePlaceId": "ChIJIRj4JS492jER_XObTEFEZQU",
    "created_at": "2026-06-14T09:15:49.404Z",
    "notes": "- very nice and new\n- no fridge, washing machine, dryer yet\n- 1st two tenants in july and aug, 4 more rooms to go, max 8 tenants\n- larger shower upstairs, or ground floor\n- gym, pool, function room as usual\n- giant seems more ex\n- simpang and east village nearby\n- further from mrt but may have some buses\n\n---\n\n1. Yes partition wall\n2. 1 is geotechnical engineer, male Myanmar in lates 20s. Friendly nice guy. 1 is security professional, in 40s Malaysian Malay. Soft spoken. \n3. Yes stamp duty payable by tenant.\n4.For noise concern, young guy asked if he can play guitar occasionally. If disturb tenant, he can dont play. Occasionally malaysian will pray in room as he is muslim. I think prayers will be soft but if its disturbing, will ask him to pray softer.",
    "updated_at": "2026-06-20T05:44:37.253Z",
    "is_taken": false
  },
  {
    "id": "ddcfce33-106b-4473-bf94-dad30a302221",
    "source_url": "https://www.propertyguru.com.sg/l/25079342",
    "title": "40 Jalan Chempaka Puteh",
    "price": 880,
    "area": "Tanah Merah",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "created_at": "2026-06-08T07:31:01.890Z",
    "lat": 1.3309263999999998,
    "lng": 103.9488927,
    "googlePlaceId": "ChIJmYoR_DE92jERmVclRJkgLg4",
    "notes": "- enter via back gate, front for landlord\n- partition wall near toilet i think\n- outside looks a bit run down\n- small window\n- recommended bicycle",
    "updated_at": "2026-06-19T18:43:51.335Z",
    "is_taken": false
  },
  {
    "id": "7c8e9a0a-35df-4ffc-a83f-4fae22e2c516",
    "source_url": "https://www.propertyguru.com.sg/listing/hdb-for-rent-112-simei-street-1-500088855",
    "title": "Simei Street 1, 112 Simei Street 1 Playground",
    "price": 1000,
    "area": "Simei",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "lat": 1.3431009999999999,
    "lng": 103.94950399999999,
    "googlePlaceId": "ChIJfxY6zCI92jERTi_UMDjFVYY",
    "created_at": "2026-06-14T09:40:16.678Z",
    "notes": "- feels hot and dead\n- share with 1 uncle and prob another roommate/couple yet to confirm\n- definitely need bigger table",
    "updated_at": "2026-06-18T14:12:19.106Z",
    "is_taken": false
  },
  {
    "id": "e53b19eb-7a67-45a0-ab9d-023b618809ca",
    "source_url": "https://www.propertyguru.com.sg/l/25091893",
    "title": "385 Tampines Street 32",
    "price": 900,
    "area": "Tampines",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "lat": 1.3546961000000002,
    "lng": 103.9587897,
    "googlePlaceId": "ChIJibZE3AI92jER_NhcBFfFOqI",
    "notes": "- share with owner and wife (but owner going overseas in few months then wife)\n- brother probably coming over to stay but student so schedules may not clash\n- aircon installation around end of year\n- two home cameras in living room\n- washer and dryer\n- dont use common area as wife wfh",
    "created_at": "2026-06-15T09:45:41.423Z",
    "updated_at": "2026-06-18T14:12:19.106Z",
    "is_taken": false
  },
  {
    "id": "5400e06e-2a08-44c5-83da-ee5bf3603484",
    "source_url": "https://www.propertyguru.com.sg/l/500156821",
    "title": "320 Ubi Avenue 1",
    "price": 900,
    "area": "Ubi",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "lat": 1.328778,
    "lng": 103.9042082,
    "googlePlaceId": "ChIJffxtyvkX2jEREPGcb6V8MSE",
    "notes": "- looks bad, broken down, bit dirty\n- toilet small, dirty\n- no dryer\n- kitchen dining area small",
    "created_at": "2026-06-15T09:41:34.967Z",
    "updated_at": "2026-06-18T14:12:19.106Z",
    "is_taken": false
  },
  {
    "id": "f6a99b03-6029-47fd-becd-55f23e867e03",
    "source_url": "https://www.propertyguru.com.sg/listing/for-rent-cascadale-60237084",
    "title": "Upper Changi Road East, Cascadale",
    "price": 1000,
    "area": "Upper Changi",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "lat": 1.3454853,
    "lng": 103.9638872,
    "googlePlaceId": "ChIJfTq5XOA82jERGRuPgjCzgBg",
    "created_at": "2026-06-14T09:23:46.067Z",
    "notes": "- only available 1st july, need store luggage and stay somewhere else",
    "updated_at": "2026-06-18T14:12:19.106Z",
    "is_taken": false
  },
  {
    "id": "70cef0d1-ff94-4176-8014-06c10d47770d",
    "source_url": "https://www.propertyguru.com.sg/listing/for-rent-simei-green-condominium-500170681",
    "title": "Simei Street 4, Simei Green Condo (Kar Loon)",
    "price": 950,
    "area": "Simei",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "created_at": "2026-06-08T01:16:48.440Z",
    "lat": 1.3410498,
    "lng": 103.9579962,
    "googlePlaceId": "ChIJV4MD4CA92jERv4rc4gVvtUA",
    "notes": "- window goes to ventilation and construction, that’s all\n- no fan, maybe not enough luggage space but real room\n- no dryer",
    "updated_at": "2026-06-18T14:12:19.106Z",
    "is_taken": false
  },
  {
    "id": "31d19591-645f-4b4e-a32d-5258ca345289",
    "source_url": "https://www.propertyguru.com.sg/listing/hdb-for-rent-859c-tampines-walk-25332445",
    "title": "859C Tampines Walk",
    "price": 1200,
    "area": "Tampines",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "lat": 1.3549890999999998,
    "lng": 103.9397887,
    "googlePlaceId": "ChIJnYNAz4E92jEReiYOtgoBvGE",
    "created_at": "2026-06-14T10:05:22.901Z",
    "notes": "• 180 degrees room, away from sun\n• new property, around 2023\n• landlady not usually home, sometimes stay with parents\n• utilities up to $150, couple moving in to other common room\n• trash throw in chute outside, preferably throw food waste by night\n• location right at tampines hub",
    "updated_at": "2026-06-18T14:12:19.106Z",
    "is_taken": false
  },
  {
    "id": "4d128aee-1a9e-4c4f-a66f-4d46cfd5e6dd",
    "source_url": "https://www.propertyguru.com.sg/listing/for-rent-changi-court-60204898",
    "title": "Upper Changi Road East, Changi Court",
    "price": 1070,
    "area": "Upper Changi",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "lat": 1.3433339,
    "lng": 103.96277029999999,
    "googlePlaceId": "ChIJAZuusd882jERd0CPxcO05FI",
    "created_at": "2026-06-14T09:24:59.919Z",
    "notes": "- 2 + 1 + 1 + 1 ‎ = 5 pax",
    "updated_at": "2026-06-18T14:12:19.106Z",
    "is_taken": false
  },
  {
    "id": "49fb55ac-f88b-4ec9-a59c-28766214fc3e",
    "source_url": "https://www.propertyguru.com.sg/listing/for-rent-the-glades-60217565",
    "title": "Bedok Rise, The Glades Condo",
    "price": 910,
    "area": "Tanah Merah",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "lat": 1.3261482999999998,
    "lng": 103.94763549999999,
    "googlePlaceId": "ChIJY9hlyDI92jER-suwBJdUjtQ",
    "created_at": "2026-06-14T08:57:36.191Z",
    "notes": "- no window\n- small table and chair\n- decent facilities\n- 3 other tenants (msian lady, chinese lady, chinese guy)\n- no nearby amenities",
    "updated_at": "2026-06-18T14:12:19.106Z",
    "is_taken": false
  },
  {
    "id": "b92f6922-65b9-4bd0-8366-c95c2042b3cb",
    "source_url": "https://www.propertyguru.com.sg/l/25529895",
    "title": "457 Tampines Street 42",
    "price": 800,
    "area": "Tampines",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "created_at": "2026-06-08T01:14:48.482Z",
    "lat": 1.3578571,
    "lng": 103.9536663,
    "googlePlaceId": "ChIJt4JtFgQ92jERDuRdWCijiHo",
    "notes": "- malay lady owner, another couple staying\n- no dryer, room smelly, no aircon\n- wash once a week, 24 hrs to wash and dry\n- no proper table and chair",
    "updated_at": "2026-06-18T14:12:19.106Z",
    "is_taken": false
  },
  {
    "id": "63337449-3578-4010-8d21-e056eda114c7",
    "source_url": "https://www.propertyguru.com.sg/listing/for-rent-simei-green-condominium-60119492",
    "title": "Simei Street 4, Simei Green Condo",
    "price": 999,
    "area": "Simei",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "lat": 1.3410498,
    "lng": 103.9579962,
    "googlePlaceId": "ChIJV4MD4CA92jERv4rc4gVvtUA",
    "created_at": "2026-06-14T09:29:25.930Z",
    "notes": "- 1st floor, balcony exit to side gate (?)\n- single bed\n- landlady and son (32 y.o.), only share bathroom with son\n- trash throw outside quite convenient\n- can use common area like dining table for eating if not shy\n- no dryer, dry outside but will be a problem if rains",
    "updated_at": "2026-06-18T14:12:19.106Z",
    "is_taken": false
  },
  {
    "id": "8b187948-b355-4ad9-bb7d-b28000f3c74f",
    "source_url": "https://www.propertyguru.com.sg/listing/for-rent-the-eden-tampines-500014388",
    "title": "The Eden at Tampines (Sean)",
    "price": 1200,
    "area": "Tampines",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "lat": 1.355224,
    "lng": 103.959261,
    "googlePlaceId": "ChIJ2c-OJpk92jERzW7V017L0kY",
    "created_at": "2026-06-14T10:00:32.799Z",
    "notes": "- normal common room, looks slightly old\n- common area for eating",
    "updated_at": "2026-06-18T14:12:19.106Z",
    "is_taken": false
  },
  {
    "id": "41d64309-4e7f-4ec7-8386-30f4dc5e01da",
    "source_url": "https://www.propertyguru.com.sg/listing/for-rent-changi-court-500095684",
    "title": "Upper Changi Road East, Changi Court",
    "price": 1000,
    "area": "Upper Changi",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "lat": 1.3433339,
    "lng": 103.96277029999999,
    "googlePlaceId": "ChIJAZuusd882jERd0CPxcO05FI",
    "created_at": "2026-06-14T09:59:22.182Z",
    "notes": "- data bad\n- biometrics, partition walls for small rooms\n- 6 share 2 toilets\n- 1 junior suite and 1 master with toilet\n- 1k with external but small, may need extra space for luggage\n- trash ownself manage\n- tenants: 1 SQ stewardess moving in, 1 W engineer, 1 indian male systems engineer",
    "updated_at": "2026-06-18T14:12:19.106Z",
    "is_taken": false
  },
  {
    "id": "ebc62a55-1808-4630-929e-018df0e61783",
    "source_url": "https://www.propertyguru.com.sg/listing/for-rent-east-meadows-25317704",
    "title": "Tanah Merah Kechil Road, East Meadows",
    "price": 1000,
    "area": "Tanah Merah",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "lat": 1.3287069000000002,
    "lng": 103.9440504,
    "googlePlaceId": "ChIJE-7phDM92jERooiwGSSUlZo",
    "created_at": "2026-06-14T09:55:10.196Z",
    "notes": "- older than casa merah",
    "updated_at": "2026-06-18T14:12:19.106Z",
    "is_taken": false
  },
  {
    "id": "92eeab98-093b-4365-9c9f-9a6a45d8ca4f",
    "source_url": "https://www.propertyguru.com.sg/listing/hdb-for-rent-185-bedok-north-road-25007160",
    "title": "Bedok North Road, Block 185",
    "price": 1000,
    "area": "Tanah Merah",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "lat": 1.3261717,
    "lng": 103.94082,
    "googlePlaceId": "ChIJ_dwI1DQ92jER8LHSXE9OEuI",
    "created_at": "2026-06-14T09:41:18.917Z",
    "notes": "- no dryer\n- share bathroom with nurse, not day schedule\n- live with owner and wife",
    "updated_at": "2026-06-18T14:12:19.106Z",
    "is_taken": false
  },
  {
    "id": "2db131b2-e629-455d-85e9-d3a661a857f5",
    "source_url": "https://www.propertyguru.com.sg/listing/for-rent-simei-green-condominium-500094747",
    "title": "Simei Street 4, Simei Green Condo",
    "price": 1200,
    "area": "Simei",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "lat": 1.3410498,
    "lng": 103.9579962,
    "googlePlaceId": "ChIJV4MD4CA92jERv4rc4gVvtUA",
    "created_at": "2026-06-14T09:31:42.591Z",
    "notes": "- 1st option smaller and +$60 but newer, window doesnt face anything, 2 big showers\n- 2nd bigger bed and room but older, 1 main and 1 small shower",
    "updated_at": "2026-06-18T14:12:19.106Z",
    "is_taken": false
  },
  {
    "id": "05067cdb-ba81-46d0-b190-200fab93f834",
    "source_url": "https://www.propertyguru.com.sg/listing/for-rent-sunhaven-500092733",
    "title": "Upper Changi Road East, Sunhaven",
    "price": 950,
    "area": "Upper Changi",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "lat": 1.3479797999999998,
    "lng": 103.9617902,
    "googlePlaceId": "ChIJwfSfu-E82jER38gQ-BY7Xmw",
    "created_at": "2026-06-14T09:25:53.882Z",
    "notes": "- 2 apartments, first one newer/renovated, second one more minimalistic and landlord want to make female-environment\n- sunhaven: 3 rooms for rent, 5 share 2 bathrooms + 1 master bedroom\n- all 1.15k?",
    "updated_at": "2026-06-18T14:12:19.106Z",
    "is_taken": false
  },
  {
    "id": "45732b7e-7ee8-45a7-aea8-ce10d8c36b3f",
    "source_url": "https://www.propertyguru.com.sg/listing/for-rent-east-view-garden-60233347",
    "title": "Jalan Pergam, East View Garden",
    "price": 1100,
    "area": "Upper Changi",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "lat": 1.3451034,
    "lng": 103.9615492,
    "googlePlaceId": "ChIJa-2XD-A82jERuMxJ9lli_yw",
    "created_at": "2026-06-14T09:23:19.285Z",
    "updated_at": "2026-06-18T14:12:19.106Z",
    "is_taken": false
  },
  {
    "id": "3383d81f-acb2-49e5-9f9f-da58ea48d0ad",
    "source_url": "https://www.propertyguru.com.sg/listing/for-rent-changi-rise-condo-60170384",
    "title": "Simei Rise, Changi Rise Condo",
    "price": 1250,
    "area": "Upper Changi",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "lat": 1.3473667,
    "lng": 103.95953829999999,
    "googlePlaceId": "ChIJ_cccAx492jERz89D8OXUyKo",
    "created_at": "2026-06-14T09:17:15.675Z",
    "notes": "• flexible roommates, can bring visitors no one really check\n• no schedule for washer/dryer, just text in group chat\n• room aircon remote may need batteries\n• gym seems busy\n• 4 others (1 cambodian, 1 malaysian, 2 indians)",
    "updated_at": "2026-06-18T14:12:19.106Z",
    "is_taken": false
  },
  {
    "id": "344484d4-8c71-48fc-be3f-8fada73c9be1",
    "source_url": "https://www.propertyguru.com.sg/listing/for-rent-eastpoint-green-16947454",
    "title": "Simei Street 3, Eastpoint Green",
    "price": 1200,
    "area": "Simei",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "lat": 1.3393621,
    "lng": 103.95067259999999,
    "googlePlaceId": "ChIJqxXxoiQ92jERTdFEeiX-vjU",
    "created_at": "2026-06-14T09:04:54.049Z",
    "notes": "- better room than prev with fan and good plug location\n- single bed is bit small\n- no schedule for washer/dryer\n- +$80 but maybe can see if include everything $1.2k, otherwise a bit ex\n- 4 tenants currently",
    "updated_at": "2026-06-18T14:12:19.106Z",
    "is_taken": false
  },
  {
    "id": "bfab542d-a498-4c73-ae90-adc01ea9540e",
    "source_url": "https://www.propertyguru.com.sg/listing/hdb-for-rent-158-tampines-street-12-500147807",
    "title": "Tampines Street 12, Block 159 HDB Tampines",
    "price": 1000,
    "area": "Tampines",
    "source_platform": "PropertyGuru",
    "status": "viewed",
    "lat": 1.3510221999999998,
    "lng": 103.945987,
    "googlePlaceId": "ChIJh91cGxE92jERXwFqF4QqXG4",
    "created_at": "2026-06-14T03:53:55.021Z",
    "notes": "- block 159 not 158 as listing shows\n- no dryer\n- one powerpoint\n- aircon at night\n- share with malaysian couple + landlady",
    "updated_at": "2026-06-18T14:12:19.106Z",
    "is_taken": false
  }
];

export const seedViewings: Viewing[] = [
  {
    "id": "119b95a9-f911-4a57-8e63-2c8ac1544197",
    "listing_id": "b92f6922-65b9-4bd0-8366-c95c2042b3cb",
    "scheduled_date": "2026-06-08T19:45",
    "created_at": "2026-06-08T01:15:06.048Z"
  },
  {
    "id": "7f2587b5-7b4f-4fc4-8495-76aa20c6792d",
    "listing_id": "70cef0d1-ff94-4176-8014-06c10d47770d",
    "scheduled_date": "2026-06-08T18:30",
    "created_at": "2026-06-08T01:17:05.848Z"
  },
  {
    "id": "b13f4b1b-b5e3-426c-b438-85f087601cb9",
    "listing_id": "5d75fd1e-8c9d-44d9-82e4-8738a917c5c7",
    "scheduled_date": "2026-06-09T19:15",
    "created_at": "2026-06-08T01:32:00.654Z"
  },
  {
    "id": "9cae0f63-fcca-454e-af9a-c9f71faf0fa8",
    "listing_id": "ddcfce33-106b-4473-bf94-dad30a302221",
    "scheduled_date": "2026-06-09T18:45",
    "created_at": "2026-06-08T07:31:16.010Z"
  },
  {
    "id": "0ac07937-ae96-4a98-bd3c-414df4f5c20f",
    "listing_id": "2cdc97ca-28b1-492d-a4cd-5c3165d561d3",
    "scheduled_date": "2026-06-01T12:00:00",
    "created_at": "2026-06-14T03:49:34.518Z"
  },
  {
    "id": "f6b9b3f5-7a0c-4451-8a5e-e1fbc3a9ee1e",
    "listing_id": "49fb55ac-f88b-4ec9-a59c-28766214fc3e",
    "scheduled_date": "2026-06-01T14:00:00",
    "created_at": "2026-06-14T08:57:55.288Z"
  },
  {
    "id": "18fcaba3-222f-43f4-b7a9-7358dbf03bab",
    "listing_id": "344484d4-8c71-48fc-be3f-8fada73c9be1",
    "scheduled_date": "2026-06-01T15:00:00",
    "created_at": "2026-06-14T09:15:27.656Z"
  },
  {
    "id": "5bbe6b55-fc74-4c79-9ae6-8db7184f557f",
    "listing_id": "abd7c50d-4588-4a9e-ba79-48a2325e2843",
    "scheduled_date": "2026-06-01T16:00:00",
    "created_at": "2026-06-14T09:16:08.528Z"
  },
  {
    "id": "059a44bc-28ea-4aed-a260-ce21e6dc72b0",
    "listing_id": "3383d81f-acb2-49e5-9f9f-da58ea48d0ad",
    "scheduled_date": "2026-06-01T17:00:00",
    "created_at": "2026-06-14T09:17:36.405Z"
  },
  {
    "id": "cd70aa9b-f19d-4b28-a56c-c684e1b28848",
    "listing_id": "45732b7e-7ee8-45a7-aea8-ce10d8c36b3f",
    "scheduled_date": "2026-06-01T17:30:00",
    "created_at": "2026-06-14T09:23:58.304Z"
  },
  {
    "id": "7c1face7-4fa8-4361-8ba6-290581fa6af5",
    "listing_id": "f6a99b03-6029-47fd-becd-55f23e867e03",
    "scheduled_date": "2026-06-01T17:30:00",
    "created_at": "2026-06-14T09:24:47.530Z"
  },
  {
    "id": "d20fc93d-57a1-472d-b5cb-490cf357e08b",
    "listing_id": "4d128aee-1a9e-4c4f-a66f-4d46cfd5e6dd",
    "scheduled_date": "2026-06-01T17:30:00",
    "created_at": "2026-06-14T09:25:35.077Z"
  },
  {
    "id": "4589528f-5f27-4e57-a16c-d83471dfa7f3",
    "listing_id": "05067cdb-ba81-46d0-b190-200fab93f834",
    "scheduled_date": "2026-06-01T17:30:00",
    "created_at": "2026-06-14T09:26:18.190Z"
  },
  {
    "id": "b7fb4a0a-f8e4-4c6e-b08a-88f3f59754ed",
    "listing_id": "2db131b2-e629-455d-85e9-d3a661a857f5",
    "scheduled_date": "2026-06-02T18:30:00",
    "created_at": "2026-06-14T09:31:59.712Z"
  },
  {
    "id": "d23d0650-4d4d-41f9-b48d-fe2e501beaa6",
    "listing_id": "7c8e9a0a-35df-4ffc-a83f-4fae22e2c516",
    "scheduled_date": "2026-06-02T19:30:00",
    "created_at": "2026-06-14T09:40:38.496Z"
  },
  {
    "id": "e1e14ba1-727e-40ed-9538-f39582a4565f",
    "listing_id": "92eeab98-093b-4365-9c9f-9a6a45d8ca4f",
    "scheduled_date": "2026-06-03T19:00:00",
    "created_at": "2026-06-14T09:41:33.089Z"
  },
  {
    "id": "f252464c-7f2f-4ec5-ad30-43ee19e7460d",
    "listing_id": "c92e2521-5499-47f7-9870-59101704c8d8",
    "scheduled_date": "2026-06-03T19:30:00",
    "created_at": "2026-06-14T09:42:30.017Z"
  },
  {
    "id": "cf703b3a-d2c3-4bb1-a240-ac45bbbf494c",
    "listing_id": "0a026350-d2dc-4c3f-b08b-8ab7723ab7a5",
    "scheduled_date": "2026-06-03T20:00:00",
    "created_at": "2026-06-14T09:47:24.820Z"
  },
  {
    "id": "3828c7fe-e816-4315-96f7-4cd159709cc7",
    "listing_id": "ebc62a55-1808-4630-929e-018df0e61783",
    "scheduled_date": "2026-06-03T20:30:00",
    "created_at": "2026-06-14T09:56:12.128Z"
  },
  {
    "id": "81368e00-9a0f-4445-90c1-f8f083333f32",
    "listing_id": "2e658503-4183-4b6b-b2e8-36daf765b333",
    "scheduled_date": "2026-06-03T20:30:00",
    "created_at": "2026-06-14T09:58:11.175Z"
  },
  {
    "id": "b9ba68a8-c008-4006-985c-3a9dab0d5682",
    "listing_id": "41d64309-4e7f-4ec7-8386-30f4dc5e01da",
    "scheduled_date": "2026-06-04T18:30:00",
    "created_at": "2026-06-14T09:59:37.036Z"
  },
  {
    "id": "76aabb82-b052-48ec-8297-c7954b0fbc1f",
    "listing_id": "8b187948-b355-4ad9-bb7d-b28000f3c74f",
    "scheduled_date": "2026-06-04T19:00:00",
    "created_at": "2026-06-14T10:00:50.279Z"
  },
  {
    "id": "023a66d8-52b6-4deb-9396-f3b9efb11073",
    "listing_id": "4e3368ec-761b-45b2-b999-5fd184e42744",
    "scheduled_date": "2026-06-04T19:45:00",
    "created_at": "2026-06-14T10:04:19.774Z"
  },
  {
    "id": "cf37f323-ff66-4cf8-b01b-fe82b32b6b3f",
    "listing_id": "31d19591-645f-4b4e-a32d-5258ca345289",
    "scheduled_date": "2026-06-05T18:30:00",
    "created_at": "2026-06-14T10:05:50.086Z"
  },
  {
    "id": "e40fdee7-35c5-48ca-9777-7f61dce75458",
    "listing_id": "2ba4f255-9581-49cd-982f-d15ed7c49be2",
    "scheduled_date": "2026-06-05T19:30:00",
    "created_at": "2026-06-14T10:06:26.366Z"
  },
  {
    "id": "46b06557-975f-448b-be3f-e099d2bb2a0d",
    "listing_id": "63337449-3578-4010-8d21-e056eda114c7",
    "scheduled_date": "2026-06-08T18:45:00",
    "created_at": "2026-06-14T10:10:44.101Z"
  },
  {
    "id": "e254a2ed-1e5e-497d-8baf-fe2e0ddd2ada",
    "listing_id": "5400e06e-2a08-44c5-83da-ee5bf3603484",
    "scheduled_date": "2026-06-15T20:00:00",
    "created_at": "2026-06-15T09:41:46.379Z"
  },
  {
    "id": "093cd8b3-a05c-498f-8eae-7e6693b55dd3",
    "listing_id": "e53b19eb-7a67-45a0-ab9d-023b618809ca",
    "scheduled_date": "2026-06-16T18:30:00",
    "created_at": "2026-06-15T09:46:31.248Z"
  },
  {
    "id": "da9d4f4b-2666-4bc8-8a85-e48ce617120e",
    "listing_id": "784c786b-860b-40e9-b367-cf69b0dc8cdc",
    "scheduled_date": "2026-06-15T19:15:00",
    "created_at": "2026-06-15T09:51:13.059Z"
  },
  {
    "id": "9c6c54af-a120-46b2-b46a-886465299cf4",
    "listing_id": "e22ff42b-99ee-449a-8fd2-f470d02ea4c9",
    "scheduled_date": "2026-06-15T18:30:00",
    "created_at": "2026-06-15T09:52:03.446Z"
  },
  {
    "id": "3a33901e-be4b-41c9-8e31-b7e766885185",
    "listing_id": "838cdfe9-1613-42da-ac14-9c6d207e3029",
    "created_at": "2026-06-17T04:16:14.431Z"
  },
  {
    "id": "d4a1f1eb-de2c-4088-a9ad-960c11c0cf10",
    "listing_id": "46c77228-a0f9-427d-a94b-0510f1e08e73",
    "scheduled_date": "2026-06-09T18:45:00",
    "created_at": "2026-06-18T14:11:47.334Z"
  },
  {
    "id": "ee271974-14a1-4c5e-8184-95a37e3c9b4d",
    "listing_id": "164fe9fe-0835-412b-9bfe-1d5a393ec56b",
    "scheduled_date": "2026-06-21T15:30:00",
    "created_at": "2026-06-21T08:03:03.503Z"
  },
  {
    "id": "de9d5d65-8292-4126-aa00-00edd6caeb6a",
    "listing_id": "1c4d6959-f428-42c5-b19e-ff85dc3c6e7f",
    "scheduled_date": "2026-06-21T17:30:00",
    "created_at": "2026-06-21T10:11:04.194Z"
  },
  {
    "id": "53fe721b-b823-4c41-aab6-44c23b805094",
    "listing_id": "3e3b333f-9a1a-4d23-b925-9e666a76e9c2",
    "scheduled_date": "2026-06-21T19:30:00",
    "created_at": "2026-06-21T11:36:06.440Z"
  },
  {
    "id": "bf317a0c-256f-424c-9910-947ea2761195",
    "listing_id": "fe50fa9b-a5a3-40be-bb5a-1ec7f1790b40",
    "scheduled_date": "2026-06-22T18:30:00",
    "created_at": "2026-06-22T14:13:51.026Z"
  },
  {
    "id": "a800f1d8-0fe1-4264-b5ef-d47c2c72fe27",
    "listing_id": "6cbba1e2-b663-40f7-b441-3f9bc6dfccb8",
    "scheduled_date": "2026-06-24T18:30:00",
    "created_at": "2026-06-24T10:22:11.851Z"
  },
  {
    "id": "ad100d74-4b24-4102-bff8-46ed6526c7ff",
    "listing_id": "bfab542d-a498-4c73-ae90-adc01ea9540e",
    "scheduled_date": "2026-06-01T05:15:00.000Z",
    "created_at": "2026-07-16T12:39:07.002Z"
  }
];

export const seedAnchors: Anchor[] = [
  {
    "id": "f2668798-9060-4a5d-83e2-8c27a55d60b8",
    "title": "Changi Business Park Central 1, Dell Technologies",
    "type": "work",
    "lat": 1.3335454,
    "lng": 103.9625317,
    "googlePlaceId": "ChIJBYDgCiE92jERfFbX-AbP4Vw",
    "address": "Changi Business Park Central 1, Dell Technologies",
    "createdAt": "2026-06-15T15:03:43.636Z"
  },
  {
    "id": "a0d44ece-22f8-4aba-a99b-8ca227a1874b",
    "title": "Ubi Avenue 4, ComfortDelGro Driving Centre",
    "type": "other",
    "lat": 1.3358621,
    "lng": 103.8966983,
    "googlePlaceId": "ChIJbTmU9rMX2jER-x-599r8Rzg",
    "address": "Ubi Avenue 4, ComfortDelGro Driving Centre",
    "createdAt": "2026-06-15T15:04:00.162Z"
  }
];

export const seedEvaluations: Evaluation[] = [
  {
    "id": "524ae137-cbbc-495f-8ecb-036702a59c45",
    "listing_id": "636f4b0c-6f43-48b0-b95d-a007bf7704d9",
    "template_id": "default",
    "responses": {
      "c3": "na",
      "c1": 1000,
      "c4": 20,
      "c5": 4,
      "c7": 4,
      "c8": 4,
      "c9": 4,
      "c10": 4,
      "c12": 4,
      "c18": 4,
      "c26": 3
    },
    "created_at": "2026-06-07T13:49:46.435Z",
    "updated_at": "2026-06-07T13:58:37.235Z"
  },
  {
    "id": "0e44b337-91b6-4151-bfd5-0fdbdb0cc72d",
    "listing_id": "ddcfce33-106b-4473-bf94-dad30a302221",
    "template_id": "default",
    "responses": {
      "c5": "Yes",
      "c7": "Yes",
      "c8": "Window",
      "c9": "Queen",
      "c10": "Partition",
      "c11": "Yes",
      "c12": "OK",
      "c16": "Yes",
      "c14": "Maybe",
      "c15": 4,
      "c17": "No",
      "c20": "Maybe",
      "c21": "Yes",
      "c22": "not too noisy can alr",
      "c24": "No",
      "c26": "giant"
    },
    "created_at": "2026-06-13T15:34:01.027Z",
    "updated_at": "2026-06-14T03:51:57.187Z"
  },
  {
    "id": "025ad9f5-be21-428d-929a-23de6df5562d",
    "listing_id": "2ba4f255-9581-49cd-982f-d15ed7c49be2",
    "template_id": "default",
    "responses": {
      "c1": "Included",
      "c3": "Yes",
      "c5": "Yes",
      "c4": 67.5
    },
    "created_at": "2026-06-13T18:00:50.655Z",
    "updated_at": "2026-06-14T14:06:56.710Z"
  },
  {
    "id": "63185bf4-8d12-4f79-b817-f2fd22118b79",
    "listing_id": "2cdc97ca-28b1-492d-a4cd-5c3165d561d3",
    "template_id": "default",
    "responses": {
      "c5": "Yes",
      "c7": "Yes",
      "c8": "Window",
      "c11": "Yes",
      "c12": "OK",
      "c16": "Yes",
      "c20": "Yes"
    },
    "created_at": "2026-06-14T03:49:06.548Z",
    "updated_at": "2026-06-20T04:38:02.679Z"
  },
  {
    "id": "b2a95e8c-650e-4f03-ba8a-212eb99dad04",
    "listing_id": "49fb55ac-f88b-4ec9-a59c-28766214fc3e",
    "template_id": "default",
    "responses": {
      "c5": "Yes",
      "c8": "No window",
      "c9": "Single",
      "c10": "Partition",
      "c11": "Yes"
    },
    "created_at": "2026-06-14T08:59:51.911Z",
    "updated_at": "2026-06-14T13:40:44.901Z"
  },
  {
    "id": "2c5d9239-ddba-45c0-a6e4-43ae22bd453b",
    "listing_id": "abd7c50d-4588-4a9e-ba79-48a2325e2843",
    "template_id": "default",
    "responses": {
      "c5": "Yes",
      "c12": "OK",
      "c11": "Yes",
      "c8": "Window",
      "c16": "Yes",
      "c17": "Yes",
      "c24": "No",
      "c20": "Maybe",
      "c22": "It depends. Mindful drinking is ok. So long dont use disturb other tenants like nuisance when drunk.\n\nBringing bunch of friends to drink here is no no."
    },
    "created_at": "2026-06-14T09:21:15.658Z",
    "updated_at": "2026-06-20T05:39:33.339Z"
  },
  {
    "id": "9575ffc6-0517-4541-be87-7f43aafe659e",
    "listing_id": "31d19591-645f-4b4e-a32d-5258ca345289",
    "template_id": "default",
    "responses": {
      "c5": "Yes",
      "c7": "Yes",
      "c8": "Window",
      "c11": "Yes",
      "c12": "OK",
      "c14": "Yes",
      "c15": 2,
      "c20": "Yes",
      "c24": "Yes"
    },
    "created_at": "2026-06-14T15:15:03.787Z",
    "updated_at": "2026-06-14T15:15:50.660Z"
  },
  {
    "id": "1ecf7665-03e8-4670-b5fd-80af67a066bf",
    "listing_id": "70cef0d1-ff94-4176-8014-06c10d47770d",
    "template_id": "default",
    "responses": {
      "c8": "Indoor window",
      "c5": "Yes",
      "c16": "Yes",
      "c17": "No"
    },
    "created_at": "2026-06-14T15:16:24.957Z",
    "updated_at": "2026-06-14T15:16:32.553Z"
  },
  {
    "id": "6c984951-fca8-4ce7-b068-9c733503c299",
    "listing_id": "f6a99b03-6029-47fd-becd-55f23e867e03",
    "template_id": "default",
    "responses": {
      "c5": "Yes",
      "c9": "Single",
      "c8": "Window",
      "c10": "Partition",
      "c11": "Yes",
      "c12": "OK",
      "c14": "Yes",
      "c16": "Yes",
      "c17": "Yes",
      "c20": "Yes"
    },
    "created_at": "2026-06-14T15:16:53.357Z",
    "updated_at": "2026-06-14T15:17:20.431Z"
  },
  {
    "id": "0c613f72-980c-4786-98a0-b4ebf6a9fd0e",
    "listing_id": "4d128aee-1a9e-4c4f-a66f-4d46cfd5e6dd",
    "template_id": "default",
    "responses": {
      "c5": "Yes",
      "c8": "Window",
      "c9": "Single",
      "c11": "Yes",
      "c14": "Yes"
    },
    "created_at": "2026-06-14T15:17:34.277Z",
    "updated_at": "2026-06-14T15:19:07.256Z"
  },
  {
    "id": "c9024aa9-0a1b-458d-a8ef-83d26ebabebd",
    "listing_id": "4e3368ec-761b-45b2-b999-5fd184e42744",
    "template_id": "default",
    "responses": {
      "c5": "Yes",
      "c7": "Yes",
      "c8": "Window",
      "c9": "Queen",
      "c11": "Maybe",
      "c12": "OK",
      "c15": 3
    },
    "created_at": "2026-06-14T15:20:02.257Z",
    "updated_at": "2026-06-14T15:20:41.419Z"
  },
  {
    "id": "c93c0e8d-bffa-45e6-81fa-54d5c32c1cea",
    "listing_id": "92eeab98-093b-4365-9c9f-9a6a45d8ca4f",
    "template_id": "default",
    "responses": {
      "c8": "Window",
      "c9": "Queen",
      "c12": "OK",
      "c14": "Yes",
      "c15": 2,
      "c16": "Yes",
      "c17": "No"
    },
    "created_at": "2026-06-14T15:23:55.950Z",
    "updated_at": "2026-06-14T15:24:26.129Z"
  },
  {
    "id": "aaac70f3-c215-4f24-b4b3-93f238223b10",
    "listing_id": "0a026350-d2dc-4c3f-b08b-8ab7723ab7a5",
    "template_id": "default",
    "responses": {
      "c8": "Indoor window",
      "c9": "Single",
      "c10": "Real wall",
      "c11": "Yes",
      "c12": "OK",
      "c16": "Yes",
      "c17": "Yes",
      "c20": "Yes",
      "c14": "Yes"
    },
    "created_at": "2026-06-14T15:38:34.004Z",
    "updated_at": "2026-06-26T01:43:14.648Z"
  },
  {
    "id": "48038b0d-ab06-4333-9b2c-de2ab0f2871b",
    "listing_id": "5d75fd1e-8c9d-44d9-82e4-8738a917c5c7",
    "template_id": "default",
    "responses": {
      "c5": "Yes",
      "c8": "Window",
      "c9": "Single",
      "c10": "Partition",
      "c11": "Yes",
      "c20": "Maybe",
      "c7": "Yes",
      "c14": "Yes",
      "c15": 6,
      "c17": "Yes",
      "c16": "Yes",
      "c21": "Day only",
      "c19": "6 pax, saw 2 indians, cooking",
      "c23": "very noisy",
      "c24": "Maybe",
      "c32": "Yes"
    },
    "created_at": "2026-06-14T16:17:09.186Z",
    "updated_at": "2026-06-19T01:56:57.349Z"
  },
  {
    "id": "33fdfd3e-ff51-4e0c-b0b1-016aa344a63a",
    "listing_id": "2e658503-4183-4b6b-b2e8-36daf765b333",
    "template_id": "default",
    "responses": {
      "c5": "Yes",
      "c8": "Window",
      "c9": "Single",
      "c10": "Partition",
      "c12": "OK",
      "c14": "Yes",
      "c16": "Yes",
      "c17": "Yes",
      "c20": "Yes",
      "c19": "\nMBR - Chinese student Female \nCR1 - Philippine Female Professional \nCR2 - Empty \nCR3 - Malaysian Chinese  male Professional \nPR1 - Taiwanese Male Student \nPR2 - empty\n\nOh East Meadows: \nPR1- Chinese male \nPR2 - Malaysian Chinese Female \nPR3 - Philippines Male \nCR1 - Empty \nCR2 - Singapore PR Indian Couple \nCR3 - Empty\nMBR- Indian male",
      "c7": "Maybe",
      "c11": "Yes",
      "c15": 5,
      "c18": "1st floor, throw outside",
      "c24": "Yes",
      "c32": "Yes"
    },
    "created_at": "2026-06-14T16:17:49.151Z",
    "updated_at": "2026-06-19T01:59:21.033Z"
  },
  {
    "id": "a14ff765-385e-4595-ba36-3ddbc49e6ae6",
    "listing_id": "5400e06e-2a08-44c5-83da-ee5bf3603484",
    "template_id": "default",
    "responses": {},
    "created_at": "2026-06-15T09:41:34.968Z",
    "updated_at": "2026-06-15T09:41:34.968Z"
  },
  {
    "id": "ff6f9618-d7c9-4ffc-887e-2b9e6a37aa2a",
    "listing_id": "e53b19eb-7a67-45a0-ab9d-023b618809ca",
    "template_id": "default",
    "responses": {
      "c5": "Yes",
      "c7": "Yes",
      "c8": "Window",
      "c9": "Single",
      "c11": "Yes",
      "c14": "Yes",
      "c15": 2,
      "c16": "Yes",
      "c17": "Yes",
      "c18": "chute outside",
      "c20": "Yes"
    },
    "created_at": "2026-06-15T09:45:41.424Z",
    "updated_at": "2026-06-16T11:10:09.421Z"
  },
  {
    "id": "a0787a67-4278-49bf-9977-19f2299e53a9",
    "listing_id": "784c786b-860b-40e9-b367-cf69b0dc8cdc",
    "template_id": "default",
    "responses": {
      "c32": "No",
      "c5": "Yes",
      "c7": "Yes",
      "c8": "Window",
      "c9": "Queen",
      "c10": "Real wall",
      "c11": "Yes",
      "c12": "OK",
      "c14": "Yes",
      "c15": 2,
      "c16": "Yes",
      "c17": "No",
      "c20": "Yes",
      "c21": "No"
    },
    "created_at": "2026-06-15T09:51:01.588Z",
    "updated_at": "2026-06-15T12:48:02.214Z"
  },
  {
    "id": "e770a8b9-f2cd-4b28-9bb0-ff07a27990c3",
    "listing_id": "e22ff42b-99ee-449a-8fd2-f470d02ea4c9",
    "template_id": "default",
    "responses": {
      "c5": "Yes",
      "c7": "Yes",
      "c8": "Window",
      "c9": "Single",
      "c10": "Real wall",
      "c11": "Yes",
      "c12": "OK",
      "c14": "Yes",
      "c15": 4,
      "c16": "Yes",
      "c17": "No",
      "c18": "throw at chute right outside",
      "c20": "Maybe",
      "c24": "Yes",
      "c21": "No",
      "c19": "2 male tenants (msia and china), both working"
    },
    "created_at": "2026-06-15T09:51:54.830Z",
    "updated_at": "2026-06-18T14:22:57.251Z"
  },
  {
    "id": "5fa25916-7fa8-40c4-abe6-8fcdb8b0a466",
    "listing_id": "838cdfe9-1613-42da-ac14-9c6d207e3029",
    "template_id": "default",
    "responses": {},
    "created_at": "2026-06-17T04:16:14.431Z",
    "updated_at": "2026-06-17T04:16:14.431Z"
  },
  {
    "id": "8f8cb981-cb01-49ab-8ba9-c2356a2f35be",
    "listing_id": "46c77228-a0f9-427d-a94b-0510f1e08e73",
    "template_id": "default",
    "responses": {
      "c5": "Yes",
      "c7": "Yes",
      "c8": "Indoor window",
      "c9": "Single",
      "c10": "Partition",
      "c11": "Yes",
      "c12": "OK",
      "c14": "Maybe",
      "c16": "Yes",
      "c17": "Yes",
      "c20": "Maybe",
      "c24": "No",
      "c15": 3,
      "c18": "just outside"
    },
    "created_at": "2026-06-18T14:10:01.871Z",
    "updated_at": "2026-06-23T15:47:23.081Z"
  },
  {
    "id": "5e11b217-a712-458c-8f4a-f66cddb07db8",
    "listing_id": "164fe9fe-0835-412b-9bfe-1d5a393ec56b",
    "template_id": "default",
    "responses": {
      "c5": "Yes",
      "c7": "Yes",
      "c8": "Window",
      "c9": "Single",
      "c10": "Partition",
      "c11": "Yes",
      "c12": "OK",
      "c14": "Yes",
      "c16": "Yes",
      "c17": "Yes",
      "c20": "Maybe",
      "c18": "chute inside",
      "c2": 50,
      "c4": 40
    },
    "created_at": "2026-06-21T08:03:03.502Z",
    "updated_at": "2026-06-24T16:31:22.012Z"
  },
  {
    "id": "6518bb3a-b37d-4308-bd1c-842898a0ed1e",
    "listing_id": "1c4d6959-f428-42c5-b19e-ff85dc3c6e7f",
    "template_id": "default",
    "responses": {
      "c4": 40
    },
    "created_at": "2026-06-21T10:11:04.194Z",
    "updated_at": "2026-06-21T12:25:23.812Z"
  },
  {
    "id": "83e4a6f6-f6b5-412b-a4a4-d2975d9808cf",
    "listing_id": "3e3b333f-9a1a-4d23-b925-9e666a76e9c2",
    "template_id": "default",
    "responses": {
      "c16": "Yes",
      "c20": "Yes"
    },
    "created_at": "2026-06-21T11:36:06.440Z",
    "updated_at": "2026-06-21T11:40:35.935Z"
  },
  {
    "id": "1086d309-c564-4591-a6d0-16a0deb295ce",
    "listing_id": "fe50fa9b-a5a3-40be-bb5a-1ec7f1790b40",
    "template_id": "default",
    "responses": {
      "c8": "Window",
      "c16": "Yes",
      "c17": "Yes",
      "c20": "Yes",
      "c24": "No",
      "c14": "Yes",
      "c15": 2,
      "c12": "OK",
      "c11": "No",
      "c10": "Real wall",
      "c5": "Yes",
      "c7": "Yes",
      "c2": 50
    },
    "created_at": "2026-06-22T10:42:00.225Z",
    "updated_at": "2026-06-22T14:13:12.962Z"
  },
  {
    "id": "af6fe695-cce4-4026-b5b6-3390ec0f34b1",
    "listing_id": "6cbba1e2-b663-40f7-b441-3f9bc6dfccb8",
    "template_id": "default",
    "responses": {
      "c5": "Yes",
      "c7": "Yes",
      "c9": "Single",
      "c16": "Yes",
      "c20": "Yes",
      "c21": "No",
      "c24": "Yes",
      "c17": "No",
      "c14": "Yes",
      "c12": "OK",
      "c11": "Yes",
      "c10": "Real wall",
      "c8": "Window"
    },
    "created_at": "2026-06-24T10:22:11.850Z",
    "updated_at": "2026-06-24T11:03:32.534Z"
  }
];

export const seedVerdicts: Verdict[] = [
  {
    "id": "707783a1-5a18-430b-a7bc-cf6986ae80b3",
    "listing_id": "81a2ce05-a806-49a5-a4b5-61ba5806b77f",
    "status": "no",
    "created_at": "2026-06-07T12:13:57.442Z",
    "updated_at": "2026-06-07T12:13:57.442Z"
  },
  {
    "id": "7cc2f1ef-b363-4c97-8179-4105d7590904",
    "listing_id": "81a2ce05-a806-49a5-a4b5-61ba5806b77f",
    "status": "no",
    "created_at": "2026-06-07T12:13:58.268Z",
    "updated_at": "2026-06-07T12:13:58.268Z"
  },
  {
    "id": "746a026e-f262-4395-a67f-ca82d073a0c3",
    "listing_id": "81a2ce05-a806-49a5-a4b5-61ba5806b77f",
    "status": "no",
    "created_at": "2026-06-07T12:13:58.601Z",
    "updated_at": "2026-06-07T12:13:58.601Z"
  },
  {
    "id": "98e8c643-12a3-458d-a002-7c0f7e2177d5",
    "listing_id": "636f4b0c-6f43-48b0-b95d-a007bf7704d9",
    "status": "no",
    "created_at": "2026-06-07T13:28:40.999Z",
    "updated_at": "2026-06-07T13:28:40.999Z"
  },
  {
    "id": "5af9e8ae-895d-4f7f-b3ba-7b5eb8ee701a",
    "listing_id": "ea7f6eb7-a317-4c30-9148-491c92cd8352",
    "status": "maybe",
    "created_at": "2026-06-08T13:54:37.074Z",
    "updated_at": "2026-06-10T14:28:17.011Z"
  },
  {
    "id": "1eedd168-0ea0-4313-89b5-148994bb4345",
    "listing_id": "2cdc97ca-28b1-492d-a4cd-5c3165d561d3",
    "status": "no",
    "created_at": "2026-06-14T03:49:41.034Z",
    "updated_at": "2026-06-14T03:49:41.034Z"
  },
  {
    "id": "1f5113fb-b22e-4669-88c9-3ac115fde111",
    "listing_id": "5d75fd1e-8c9d-44d9-82e4-8738a917c5c7",
    "status": "no",
    "created_at": "2026-06-14T03:49:44.158Z",
    "updated_at": "2026-06-21T10:10:10.903Z",
    "reasoning": "unresponsive agent"
  },
  {
    "id": "2ef3c461-9173-4ddb-91d4-7a07f3ec702f",
    "listing_id": "ddcfce33-106b-4473-bf94-dad30a302221",
    "status": "no",
    "created_at": "2026-06-14T03:49:53.924Z",
    "updated_at": "2026-06-14T09:13:44.361Z",
    "reasoning": "- recommended to get bicycle"
  },
  {
    "id": "4c7a7a94-1a83-456e-b0c6-b4f2d8dbf573",
    "listing_id": "b92f6922-65b9-4bd0-8366-c95c2042b3cb",
    "status": "no",
    "created_at": "2026-06-14T03:52:30.358Z",
    "updated_at": "2026-06-14T03:52:30.358Z"
  },
  {
    "id": "c9fc2b04-9540-469a-b515-e8a3af288b7c",
    "listing_id": "2ba4f255-9581-49cd-982f-d15ed7c49be2",
    "status": "no",
    "created_at": "2026-06-14T03:52:36.575Z",
    "updated_at": "2026-06-14T14:07:03.415Z"
  },
  {
    "id": "1a1f8247-86be-4f9a-bd30-9006d4503c73",
    "listing_id": "bfab542d-a498-4c73-ae90-adc01ea9540e",
    "status": "no",
    "created_at": "2026-06-14T03:53:58.389Z",
    "updated_at": "2026-06-14T09:13:42.728Z"
  },
  {
    "id": "ac31bf4b-31ce-499a-b0fa-156c417b6f0a",
    "listing_id": "49fb55ac-f88b-4ec9-a59c-28766214fc3e",
    "status": "no",
    "created_at": "2026-06-14T08:57:38.846Z",
    "updated_at": "2026-06-14T13:41:03.054Z"
  },
  {
    "id": "1cf33bdc-ca16-41fd-8e85-91b5be06c7c3",
    "listing_id": "344484d4-8c71-48fc-be3f-8fada73c9be1",
    "status": "no",
    "created_at": "2026-06-14T09:04:57.263Z",
    "updated_at": "2026-06-14T09:13:38.253Z"
  },
  {
    "id": "037dcec7-4c46-419e-9835-496172bbb76d",
    "listing_id": "abd7c50d-4588-4a9e-ba79-48a2325e2843",
    "status": "no",
    "created_at": "2026-06-14T09:15:52.161Z",
    "updated_at": "2026-06-17T01:37:20.541Z",
    "reasoning": "probably too ex"
  },
  {
    "id": "f5dfce47-ade0-438a-8215-7094620f7d84",
    "listing_id": "3383d81f-acb2-49e5-9f9f-da58ea48d0ad",
    "status": "no",
    "created_at": "2026-06-14T09:17:18.741Z",
    "updated_at": "2026-06-14T09:17:18.741Z"
  },
  {
    "id": "f22f89a5-2012-46a4-b726-50df70ba47ac",
    "listing_id": "45732b7e-7ee8-45a7-aea8-ce10d8c36b3f",
    "status": "no",
    "created_at": "2026-06-14T09:23:22.026Z",
    "updated_at": "2026-06-14T09:23:22.026Z"
  },
  {
    "id": "63cbfa58-5b7f-4914-8994-b0b68e01627b",
    "listing_id": "f6a99b03-6029-47fd-becd-55f23e867e03",
    "status": "no",
    "created_at": "2026-06-14T09:23:47.892Z",
    "updated_at": "2026-06-14T14:00:37.303Z"
  },
  {
    "id": "11ed2be7-bf72-4f6d-b95f-e58d401d021d",
    "listing_id": "4d128aee-1a9e-4c4f-a66f-4d46cfd5e6dd",
    "status": "no",
    "created_at": "2026-06-14T09:25:01.599Z",
    "updated_at": "2026-06-14T14:00:35.539Z"
  },
  {
    "id": "24e01207-01a5-44a6-85b8-b97c106eb584",
    "listing_id": "05067cdb-ba81-46d0-b190-200fab93f834",
    "status": "no",
    "created_at": "2026-06-14T09:25:55.262Z",
    "updated_at": "2026-06-14T09:25:55.262Z"
  },
  {
    "id": "d1234aaa-8349-45da-a26d-77fd957f129f",
    "listing_id": "63337449-3578-4010-8d21-e056eda114c7",
    "status": "no",
    "created_at": "2026-06-14T09:29:29.743Z",
    "updated_at": "2026-06-14T09:29:29.743Z"
  },
  {
    "id": "3541ba3f-bd52-48fd-893b-c5ef46d55b31",
    "listing_id": "2db131b2-e629-455d-85e9-d3a661a857f5",
    "status": "no",
    "created_at": "2026-06-14T09:32:02.387Z",
    "updated_at": "2026-06-14T09:32:02.387Z"
  },
  {
    "id": "45ac2028-976d-432f-9163-765d4783dd22",
    "listing_id": "7c8e9a0a-35df-4ffc-a83f-4fae22e2c516",
    "status": "no",
    "created_at": "2026-06-14T09:40:18.094Z",
    "updated_at": "2026-06-17T01:38:04.818Z"
  },
  {
    "id": "c214b953-93e1-4e68-8022-d3faeb8a9d12",
    "listing_id": "92eeab98-093b-4365-9c9f-9a6a45d8ca4f",
    "status": "no",
    "created_at": "2026-06-14T09:41:21.295Z",
    "updated_at": "2026-06-14T09:41:21.295Z"
  },
  {
    "id": "30756d6b-f442-4e9e-8ba5-f2255a2cda34",
    "listing_id": "c92e2521-5499-47f7-9870-59101704c8d8",
    "status": "no",
    "created_at": "2026-06-14T09:41:57.865Z",
    "updated_at": "2026-06-21T12:26:58.026Z",
    "reasoning": "too ex, $1k alr without utils and dryer , rather stay decent condo"
  },
  {
    "id": "d6364b8f-738c-44f2-8d00-7b4317eba443",
    "listing_id": "0a026350-d2dc-4c3f-b08b-8ab7723ab7a5",
    "status": "yes",
    "created_at": "2026-06-14T09:47:30.184Z",
    "updated_at": "2026-06-26T01:43:22.634Z",
    "reasoning": "no external window"
  },
  {
    "id": "1cbdd8b9-a8d1-4704-821b-86ecb26661b7",
    "listing_id": "ebc62a55-1808-4630-929e-018df0e61783",
    "status": "no",
    "created_at": "2026-06-14T09:55:12.124Z",
    "updated_at": "2026-06-14T09:55:12.124Z"
  },
  {
    "id": "f460553c-810c-46af-ae3b-ffa096d742dd",
    "listing_id": "2e658503-4183-4b6b-b2e8-36daf765b333",
    "status": "yes",
    "created_at": "2026-06-14T09:57:56.977Z",
    "updated_at": "2026-06-14T14:20:56.767Z"
  },
  {
    "id": "38f362c1-4026-4101-bf41-76a1ece7879e",
    "listing_id": "41d64309-4e7f-4ec7-8386-30f4dc5e01da",
    "status": "no",
    "created_at": "2026-06-14T09:59:23.475Z",
    "updated_at": "2026-06-14T09:59:23.475Z"
  },
  {
    "id": "04842d3e-7975-4f1b-906f-1408aee94f3d",
    "listing_id": "8b187948-b355-4ad9-bb7d-b28000f3c74f",
    "status": "no",
    "created_at": "2026-06-14T10:00:34.385Z",
    "updated_at": "2026-06-14T10:00:35.652Z"
  },
  {
    "id": "dfa381f0-f101-4837-84d1-d9c032fb6234",
    "listing_id": "4e3368ec-761b-45b2-b999-5fd184e42744",
    "status": "maybe",
    "created_at": "2026-06-14T10:04:00.660Z",
    "updated_at": "2026-06-14T10:04:00.660Z"
  },
  {
    "id": "b8a38051-e096-47fd-95f3-fb4b827c3f08",
    "listing_id": "31d19591-645f-4b4e-a32d-5258ca345289",
    "status": "no",
    "created_at": "2026-06-14T10:05:24.714Z",
    "updated_at": "2026-06-14T14:10:15.227Z"
  },
  {
    "id": "e8a25879-6827-468d-9d15-cafe92efaa44",
    "listing_id": "70cef0d1-ff94-4176-8014-06c10d47770d",
    "status": "no",
    "created_at": "2026-06-14T14:32:25.286Z",
    "updated_at": "2026-06-14T14:32:25.286Z"
  },
  {
    "id": "130ef10f-8d90-4d83-8bcb-29508fcadb05",
    "listing_id": "e22ff42b-99ee-449a-8fd2-f470d02ea4c9",
    "status": "no",
    "created_at": "2026-06-15T14:28:22.428Z",
    "updated_at": "2026-06-19T02:17:48.302Z",
    "reasoning": "taken by someone"
  },
  {
    "id": "f98dcfa8-ba88-4208-bbff-a587739a2808",
    "listing_id": "5400e06e-2a08-44c5-83da-ee5bf3603484",
    "status": "no",
    "created_at": "2026-06-15T14:29:00.089Z",
    "updated_at": "2026-06-15T14:29:00.089Z"
  },
  {
    "id": "5894c5cc-ae04-48a2-9b0a-10f29a4bd60d",
    "listing_id": "784c786b-860b-40e9-b367-cf69b0dc8cdc",
    "status": "no",
    "created_at": "2026-06-15T14:29:06.605Z",
    "updated_at": "2026-06-18T14:00:55.947Z",
    "reasoning": "only share with 1 other tenant but room too big and a bit ex"
  },
  {
    "id": "e0e4db18-9d08-4386-8d86-6ca8a3b1f317",
    "listing_id": "e53b19eb-7a67-45a0-ab9d-023b618809ca",
    "status": "no",
    "created_at": "2026-06-16T11:10:22.402Z",
    "updated_at": "2026-06-16T11:10:22.402Z"
  },
  {
    "id": "4992a461-9cc4-481e-8579-b61afdb137a2",
    "listing_id": "838cdfe9-1613-42da-ac14-9c6d207e3029",
    "status": "no",
    "created_at": "2026-06-18T05:42:21.852Z",
    "updated_at": "2026-06-18T11:43:03.455Z"
  },
  {
    "id": "c62cbfc8-03f5-4b6d-be7f-13eb7bed74ba",
    "listing_id": "164fe9fe-0835-412b-9bfe-1d5a393ec56b",
    "status": "no",
    "created_at": "2026-06-21T08:03:14.494Z",
    "updated_at": "2026-06-26T05:23:16.976Z",
    "reasoning": "taken"
  },
  {
    "id": "03feb8d2-2d92-411f-b345-8bcbae5bd197",
    "listing_id": "1c4d6959-f428-42c5-b19e-ff85dc3c6e7f",
    "status": "no",
    "created_at": "2026-06-21T12:25:10.741Z",
    "updated_at": "2026-06-21T12:25:10.741Z"
  },
  {
    "id": "5e256f7f-e92a-4adc-988d-520096c4f217",
    "listing_id": "3e3b333f-9a1a-4d23-b925-9e666a76e9c2",
    "status": "maybe",
    "created_at": "2026-06-21T12:25:34.407Z",
    "updated_at": "2026-06-21T12:25:34.407Z"
  },
  {
    "id": "4adf38fd-023f-4ecb-8b25-2ba2cfdf1a88",
    "listing_id": "fe50fa9b-a5a3-40be-bb5a-1ec7f1790b40",
    "status": "maybe",
    "created_at": "2026-06-22T14:12:41.917Z",
    "updated_at": "2026-06-22T14:12:41.917Z"
  },
  {
    "id": "302765db-d5af-45ad-9c74-255c1033d544",
    "listing_id": "6cbba1e2-b663-40f7-b441-3f9bc6dfccb8",
    "status": "yes",
    "created_at": "2026-06-24T10:51:27.702Z",
    "updated_at": "2026-06-24T10:51:27.702Z"
  },
  {
    "id": "8ed5dbee-03b5-47a9-8d9d-c9ed9774e296",
    "listing_id": "46c77228-a0f9-427d-a94b-0510f1e08e73",
    "status": "yes",
    "created_at": "2026-06-24T17:01:16.803Z",
    "updated_at": "2026-06-24T17:01:16.803Z"
  }
];

export const seedComparisonIds: string[] = [
  "5d75fd1e-8c9d-44d9-82e4-8738a917c5c7",
  "2e658503-4183-4b6b-b2e8-36daf765b333",
  "46c77228-a0f9-427d-a94b-0510f1e08e73"
];

const BACKUP_KEY = "user-data-backup";
const SEED_FLAG = "seed-mode-active";

export function isSeedModeActive(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SEED_FLAG) === "true";
}

export function isAnyStoreEmpty(): boolean {
  if (typeof window === "undefined") return false;
  const raw = localStorage.getItem("listing-storage");
  if (!raw) return true;
  try {
    const parsed = JSON.parse(raw);
    return !parsed?.state?.listings?.length;
  } catch {
    return true;
  }
}

export function backupUserData(): boolean {
  const backup: Record<string, unknown> = {};
  for (const key of getStoreKeys()) {
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        backup[key] = JSON.parse(raw);
      } catch {
        backup[key] = raw;
      }
    }
  }
  if (Object.keys(backup).length === 0) return false;
  localStorage.setItem(BACKUP_KEY, JSON.stringify(backup));
  return true;
}

export function restoreUserData(): boolean {
  const raw = localStorage.getItem(BACKUP_KEY);
  if (!raw) return false;
  try {
    const backup = JSON.parse(raw) as Record<string, unknown>;
    const backupKeys = new Set(
      Object.keys(backup).filter((k) => k.endsWith("-storage"))
    );
    for (const key of backupKeys) {
      localStorage.setItem(key, JSON.stringify(backup[key]));
    }
    for (const key of getStoreKeys()) {
      if (!backupKeys.has(key)) {
        localStorage.removeItem(key);
      }
    }
    localStorage.removeItem(BACKUP_KEY);
    localStorage.removeItem(SEED_FLAG);
    return true;
  } catch {
    return false;
  }
}

export function loadSeedData(): void {
  const payload: Record<string, { state: unknown; version: number }> = {
    "listing-storage": { state: { listings: seedListings }, version: 0 },
    "viewing-storage": { state: { viewings: seedViewings }, version: 0 },
    "evaluation-storage": {
      state: { evaluations: seedEvaluations },
      version: 0,
    },
    "verdict-storage": { state: { verdicts: seedVerdicts }, version: 0 },
    "comparison-storage": {
      state: { selectedListingIds: seedComparisonIds },
      version: 0,
    },
    "anchor-storage": { state: { anchors: seedAnchors }, version: 0 },
  };

  for (const [key, value] of Object.entries(payload)) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  localStorage.setItem(SEED_FLAG, "true");
}

export function toggleSeedMode(): "seed" | "user" | null {
  if (isSeedModeActive()) {
    const ok = restoreUserData();
    return ok ? "user" : null;
  } else {
    backupUserData();
    loadSeedData();
    return "seed";
  }
}
