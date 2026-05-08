/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';
import { 
  Sparkles, 
  BookOpen, 
  Droplets, 
  Sun, 
  Moon, 
  AlignLeft, 
  ChevronRight,
  Search,
  CheckCircle2,
  AlertCircle,
  Send,
  Loader2,
  Camera,
  X,
  Video
} from 'lucide-react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Data Models
type Tab = 'assistant' | 'knowledge' | 'routine' | 'visualizer';

interface IngredientBenefit {
  name: string;
  icon: string;
  description: string;
  benefits?: string;
  howItWorks?: string;
  usageNotes?: string;
}

interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  content: React.ReactNode;
  textContent: string;
  icon: React.ReactNode;
  ingredients?: IngredientBenefit[];
}

interface RoutineStep {
  id: string;
  time: 'morning' | 'night';
  step: number;
  name: string;
  description: string;
  completed: boolean;
}

// Mock Data
const ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Understanding Dark Spots (Hyperpigmentation)',
    category: 'Treatment',
    readTime: '4 min read',
    icon: <Sun size={20} className="text-accent-peach-dark" />,
    textContent: 'What are dark spots? Dark spots, or hyperpigmentation, occur when the skin produces more melanin than usual. Melanin is the pigment that gives eyes, skin, and hair their color. Common Causes: Sun exposure (sunspots) Hormonal changes (melasma) Inflammation or injury to the skin (post-inflammatory hyperpigmentation) Key Ingredients to Look For: Vitamin C, Niacinamide, Alpha Hydroxy Acids (AHAs) like glycolic acid, and Kojic acid. Most importantly, daily use of broad-spectrum sunscreen (SPF 30+) is crucial.',
    ingredients: [
      { name: "Vitamin C", icon: "🍊", description: "Inhibits melanin production and fades dark spots while brightening.", benefits: "Brightens complexion, reduces hyperpigmentation, and promotes a more even skin tone.", howItWorks: "Blocks the enzyme tyrosinase, which is required for melanin production.", usageNotes: "Best used in the morning. Always follow with SPF as it can make skin photosensitive." },
      { name: "Niacinamide", icon: "🧪", description: "Helps prevent melanin transfer to skin cells and reduces inflammation.", benefits: "Soothes redness, minimizes pores, and helps fade dark spots without irritation.", howItWorks: "Prevents the upward transfer of melanin from melanocytes to the skin's surface cells.", usageNotes: "Can be used morning and night. Plays well with most other ingredients." },
      { name: "AHAs", icon: "✨", description: "Exfoliates the surface to shed pigmented skin cells.", benefits: "Smooths skin texture and accelerates the fading of surface-level dark spots.", howItWorks: "Dissolves the 'glue' holding dead skin cells together, promoting exfoliation.", usageNotes: "Use 2-3 times a week at night. Use sunscreen diligently, as AHAs increase sun sensitivity." },
      { name: "Sunscreen SPF 30+", icon: "🧴", description: "Prevents UV rays from triggering more melanin synthesis.", benefits: "Protects against sunburn, photoaging, and prevents existing dark spots from worsening.", howItWorks: "Absorbs or reflects harmful UVA/UVB rays before they penetrate the skin.", usageNotes: "Apply an even layer as the final step in your morning routine. Reapply every 2 hours if outdoors." }
    ],
    content: (
      <div className="space-y-4 text-sm text-text-muted leading-relaxed">
        <p><strong>What are dark spots?</strong></p>
        <p>Dark spots, or hyperpigmentation, occur when the skin produces more melanin than usual. Melanin is the pigment that gives eyes, skin, and hair their color.</p>
        <p><strong>Common Causes:</strong></p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Sun exposure (sunspots)</li>
          <li>Hormonal changes (melasma)</li>
          <li>Inflammation or injury to the skin (post-inflammatory hyperpigmentation)</li>
        </ul>
        <p><strong>Key Ingredients to Look For:</strong></p>
        <p>Vitamin C, Niacinamide, Alpha Hydroxy Acids (AHAs) like glycolic acid, and Kojic acid. Most importantly, daily use of broad-spectrum sunscreen (SPF 30+) is crucial.</p>
      </div>
    )
  },
  {
    id: '2',
    title: 'How to Gently Remove Sun Tan',
    category: 'Prevention',
    readTime: '3 min read',
    icon: <Sun size={20} className="text-primary" />,
    textContent: 'Why does tanning happen? Tanning is your body\'s attempt to protect itself from the sun\'s damaging UV rays by producing more melanin. Safe ways to reduce tan: Gentle Exfoliation: Use mild chemical exfoliants (like lactic acid or mild glycolic acid) to help shed dead, tanned skin cells. Avoid harsh physical scrubs. Brightening Ingredients: Incorporate Vitamin C or Licorice extract into your routine. Hydration: Keep the skin moisturized with hyaluronic acid and ceramides to aid skin barrier repair. Warning Never try to bleach a tan. Skin bleach can cause severe irritation and long-term damage.',
    ingredients: [
      { name: "Lactic Acid", icon: "🥛", description: "A mild AHA that gently dissolves dead cells to lift off tan.", benefits: "Gently exfoliates while drawing moisture into the skin.", howItWorks: "Dissolves dead skin cell bonds. Because of its larger molecule size, it doesn't penetrate as deeply, causing less irritation.", usageNotes: "Ideal for beginners or sensitive skin. Use 2-3 nights a week." },
      { name: "Licorice Extract", icon: "🌿", description: "Soothes skin and contains glabridin, which naturally brightens.", benefits: "Calms inflammation and provides a natural, gentle brightening effect.", howItWorks: "Contains liquiritin and glabridin which disrupt melanin synthesis and disperse existing pigment.", usageNotes: "Safe for daily use. Great for those who cannot tolerate Vitamin C." },
      { name: "Hyaluronic Acid", icon: "💧", description: "Binds water to the skin to keep it plump and aid in recovery.", benefits: "Instantly hydrates, leaving skin plump, bouncy, and reducing fine lines.", howItWorks: "Acts as a humectant, drawing water from the environment into the skin (holds up to 1000x its weight in water).", usageNotes: "Apply on slightly damp skin, then lock it in with a moisturizer." }
    ],
    content: (
      <div className="space-y-4 text-sm text-text-muted leading-relaxed">
        <p><strong>Why does tanning happen?</strong></p>
        <p>Tanning is your body's attempt to protect itself from the sun's damaging UV rays by producing more melanin.</p>
        <p><strong>Safe ways to reduce tan:</strong></p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Gentle Exfoliation:</strong> Use mild chemical exfoliants (like lactic acid or mild glycolic acid) to help shed dead, tanned skin cells. Avoid harsh physical scrubs.</li>
          <li><strong>Brightening Ingredients:</strong> Incorporate Vitamin C or Licorice extract into your routine.</li>
          <li><strong>Hydration:</strong> Keep the skin moisturized with hyaluronic acid and ceramides to aid skin barrier repair.</li>
        </ul>
        <div className="bg-primary-light p-3 rounded-lg border border-primary text-primary-dark">
          <p className="font-semibold flex items-center gap-2"><AlertCircle size={16}/> Warning</p>
          <p>Never try to bleach a tan. Skin bleach can cause severe irritation and long-term damage.</p>
        </div>
      </div>
    )
  },
  {
    id: '3',
    title: 'The Essential Beginner Routine',
    category: 'Basics',
    readTime: '2 min read',
    icon: <Droplets size={20} className="text-blue-500" />,
    textContent: 'A basic skincare routine doesn\'t need to be complicated. Stick to the essentials: Cleanse: Wash your face twice a day with a gentle, non-stripping cleanser. Moisturize: Apply a moisturizer while skin is still slightly damp to lock in hydration. Protect: The most important step. Apply SPF 30 or higher every single morning, rain or shine.',
    ingredients: [
      { name: "Gentle Cleanser", icon: "🫧", description: "Removes dirt and excess oil without stripping the natural barrier.", benefits: "Keeps pores clear and prevents breakouts without causing dryness or tightness.", howItWorks: "Uses mild surfactants to bind to dirt and oil so they can be rinsed away without damaging skin lipids.", usageNotes: "Use twice daily. Massage gently for 60 seconds before rinsing with lukewarm water." },
      { name: "Moisturizer", icon: "🧴", description: "Seals in hydration to keep skin balanced and healthy.", benefits: "Prevents water loss, softens skin texture, and maintains a healthy skin barrier.", howItWorks: "Combines humectants (water-drawing), emollients (smoothing), and occlusives (sealing) for total hydration.", usageNotes: "Apply twice daily as the last step at night, and right before sunscreen in the morning." },
      { name: "Broad-Spectrum SPF", icon: "☀️", description: "Crucial defense against photoaging and skin cancer.", benefits: "Shields skin from UV damage, preventing premature aging and hyperpigmentation.", howItWorks: "Forms a protective layer that absorbs or reflects harmful UVA and UVB radiation.", usageNotes: "Apply 1/4 teaspoon to the face every single morning, regardless of the weather." }
    ],
    content: (
      <div className="space-y-4 text-sm text-text-muted leading-relaxed">
        <p>A basic skincare routine doesn't need to be complicated. Stick to the essentials:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Cleanse:</strong> Wash your face twice a day with a gentle, non-stripping cleanser.</li>
          <li><strong>Moisturize:</strong> Apply a moisturizer while skin is still slightly damp to lock in hydration.</li>
          <li><strong>Protect:</strong> The most important step. Apply SPF 30 or higher every single morning, rain or shine.</li>
        </ol>
      </div>
    )
  },
  {
    id: '4',
    title: 'Common Skin Concerns for Indian Skin',
    category: 'Skin Types',
    readTime: '4 min read',
    icon: <AlertCircle size={20} className="text-accent-rose-dark" />,
    textContent: 'Indian skin, typically falling between types III and V on the Fitzpatrick scale, has its own unique characteristics and common concerns. Pigmentation: Higher melanin content means Indian skin is highly prone to hyperpigmentation and dark spots, especially after acne (PIH) or sun exposure. Tanning: Due to strong sun exposure, tanning and uneven skin tone are very common. Sensitivity to Pollution: High pollution levels in many Indian cities lead to clogged pores, dullness, and premature aging. Recommended Approach: Use gentle exfoliants like Lactic acid or Mandelic acid instead of harsh scrubs. Always use a broad-spectrum sunscreen (even indoors) and incorporate antioxidants like Vitamin C to combat pollution and pigmentation.',
    ingredients: [
      { name: "Mandelic Acid", icon: "🌰", description: "A larger-molecule AHA that exfoliates gently, ideal for deeper skin tones without triggering PIH.", benefits: "Exfoliates surface skin, treats acne, and fades hyperpigmentation safely for melanin-rich skin.", howItWorks: "Because its molecules are large, it penetrates the skin slowly, reducing the risk of inflammatory hyperpigmentation.", usageNotes: "Great for sensitive or darker skin tones. Use 2-3 nights a week." },
      { name: "Iron Oxides", icon: "🛡️", description: "Typically found in tinted sunscreens, protects against visible light which worsens melasma.", benefits: "Offers an extra layer of protection against blue light and helps even out the complexion.", howItWorks: "Unlike standard UV filters, iron oxides physically block visible and blue light spectrums.", usageNotes: "Look for tinted sunscreens, especially if you struggle with melasma or stubborn dark spots." },
      { name: "Antioxidants", icon: "🛡️", description: "Neutralizes free radicals from pollution before they damage skin cells.", benefits: "Brightens skin, reduces redness, and prevents premature aging caused by environmental stressors.", howItWorks: "They donate an electron to unstable free radicals, neutralizing them before they can damage skin cells.", usageNotes: "Incorporate via serums (like Vitamin C, Niacinamide) in your morning routine." }
    ],
    content: (
      <div className="space-y-4 text-sm text-text-muted leading-relaxed">
        <p>Indian skin, typically falling between types III and V on the Fitzpatrick scale, has its own unique characteristics and common concerns due to biology and regional climate.</p>
        <p><strong>1. Pigmentation & Uneven Skin Tone:</strong> Higher melanin content means Indian skin is highly prone to hyperpigmentation, melasma, and dark spots, especially after acne (Post-Inflammatory Hyperpigmentation) or sun exposure.</p>
        <p><strong>2. Tanning:</strong> Constant exposure to strong sun makes severe tanning and uneven patches a common complaint.</p>
        <p><strong>3. Pollution-Induced Damage:</strong> High pollution levels in many Indian cities lead to clogged pores, free radical damage, dullness, and premature aging.</p>
        <div className="bg-accent-rose/50 p-4 rounded-xl border border-accent-rose-dark/30 text-text-main">
          <p className="font-semibold mb-2">Expert Advice for Indian Skin:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Avoid harsh physical scrubs which can trigger more pigmentation. Use mild AHAs like Mandelic or Lactic acid.</li>
            <li>Incorporate antioxidants (Vitamin C, Niacinamide) to combat pollution and even out tone.</li>
            <li>Sunscreen is non-negotiable. Tinted sunscreens with Iron Oxides offer extra protection against visible light that worsens melasma.</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: '5',
    title: 'Guide to Serums & Glowing Skin Ingredients',
    category: 'Ingredients',
    readTime: '5 min read',
    icon: <Sparkles size={20} className="text-primary-dark" />,
    textContent: 'Achieving that coveted radiant, glowing skin often relies on the targeted use of serums. Serums are lightweight formulas packed with active ingredients. Vitamin C (L-Ascorbic Acid): A powerhouse antioxidant that brightens the skin, fades dark spots, and boosts collagen. Best used in the morning under sunscreen. Niacinamide (Vitamin B3): An incredible all-rounder that evens skin tone, reduces redness, minimizes pore appearance, and strengthens the skin barrier. Hyaluronic Acid: Acts like a sponge for your skin, pulling in hydration and giving a plump, dewy glow. Alpha Arbutin & Licorice Extract: Excellent, gentle alternatives to hydroquinone for fading pigmentation and promoting a uniform glow. How to use: Apply serums after cleansing (and toning) but before your moisturizer to seal them in.',
    ingredients: [
      { name: "L-Ascorbic Acid (Vit C)", icon: "🍋", description: "Most potent form of Vitamin C for a bright, radiant complexion.", benefits: "Delivers maximum brightening, anti-aging, and protective effects.", howItWorks: "Directly absorbed into the skin to neutralize free radicals and inhibit excess melanin production.", usageNotes: "Highly effective but very unstable. Keep away from light and air. May irritate sensitive skin." },
      { name: "Alpha Arbutin", icon: "🫐", description: "Safely inhibits tyrosinase enzymes to fade stubborn spots effectively.", benefits: "Provides excellent hyperpigmentation fading without the severe irritation associated with hydroquinone.", howItWorks: "Slowly releases hydroquinone over time, inhibiting the tyrosinase enzyme that creates melanin.", usageNotes: "Gentle enough for daily use. Often paired with Vitamin C or Niacinamide for enhanced results." },
      { name: "Vitamin B3 (Niacinamide)", icon: "🌾", description: "Boosts ceramide production for a strong, resilient skin barrier.", benefits: "Improves overall skin texture, fades spots, and noticeably reduces the appearance of enlarged pores.", howItWorks: "Stimulates keratin and ceramide synthesis, improving skin's barrier integrity.", usageNotes: "Usually well-tolerated up to 10% concentration. Can be used daily, morning and evening." }
    ],
    content: (
      <div className="space-y-4 text-sm text-text-muted leading-relaxed">
        <p>Achieving radiant, glowing skin often relies on the targeted use of serums. Serums are lightweight, fast-absorbing liquids packed with a high concentration of active ingredients.</p>
        <p><strong>Top Ingredients for a Glow:</strong></p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Vitamin C (L-Ascorbic Acid):</strong> A powerhouse antioxidant that brightens the complexion, fades dark spots, protects against environmental damage, and boosts collagen. Best used in your morning routine.</li>
          <li><strong>Niacinamide (Vitamin B3):</strong> An incredible all-rounder. It evens skin tone, reduces redness, minimizes the appearance of pores, calms breakout inflammation, and strengthens the skin barrier.</li>
          <li><strong>Hyaluronic Acid:</strong> Acts like a sponge for your skin, pulling in hydration from the environment and giving your face a plump, dewy bounce.</li>
          <li><strong>Alpha Arbutin & Licorice Extract:</strong> Excellent, gentle ingredients specifically targeted at fading pigmentation and promoting a uniform, bright glow without irritation.</li>
        </ul>
        <p><strong>How to Layer:</strong> Always apply serums on clean skin. If using multiple, apply from thinnest consistency to thickest. Seal them in with a moisturizer!</p>
      </div>
    )
  },
  {
    id: '6',
    title: 'Hidden but Heroic Ingredients',
    category: 'Ingredients',
    readTime: '6 min read',
    icon: <Sparkles size={20} className="text-accent-peach-dark" />,
    textContent: 'While Vitamin C and Retinol get all the glory, there are several "hidden heroic" ingredients that can quietly transform your skin. Centella Asiatica (Cica): A legendary soothing herb that repairs the skin barrier and calms redness immediately. Azelaic Acid: Often overlooked, it gently exfoliates, kills acne-causing bacteria, and is incredibly effective at fading post-acne marks (PIH). Snail Mucin: Hydrates, repairs, and gives a glass-skin effect without clogging pores. Panthenol (Pro-Vitamin B5): A humectant and emollient that draws in moisture and reduces inflammation. Ceramides: The glue that holds your skin cells together; vital for a healthy, bouncy skin barrier.',
    ingredients: [
      { name: "Centella Asiatica (Cica)", icon: "🌿", description: "Instantly calms irritation and speeds up wound healing and barrier repair.", benefits: "Soothes intense redness, reduces inflammation, and patches up a compromised skin barrier.", howItWorks: "Rich in saponins that stimulate collagen synthesis and promote microcirculation for rapid healing.", usageNotes: "Excellent post-sun exposure or after using strong chemical exfoliants. Very gentle for all skin types." },
      { name: "Azelaic Acid", icon: "🌾", description: "Fades dark spots, reduces redness (rosacea), and gently unclogs pores.", benefits: "Multi-functional: targets acne, dramatically reduces redness (especially rosacea), and fades dark marks.", howItWorks: "Exerts antibacterial, keratolytic (pore-clearing), and anti-inflammatory effects simultaneously.", usageNotes: "Can cause mild tingling initially. Start with lower concentrations (10%) every other day." },
      { name: "Snail Mucin", icon: "🐌", description: "Packs a hydrating punch and repairs damaged skin for a natural glow.", benefits: "Intensely hydrates, promotes a 'glass skin' look, and helps heal superficial acne scars.", howItWorks: "Naturally contains hyaluronic acid, glycolic acid, and copper peptides which work synergistically to repair.", usageNotes: "Apply on slightly damp skin. Pat it in gently until fully absorbed." },
      { name: "Panthenol (Vit B5)", icon: "💧", description: "Soothes stressed skin and locks in deep hydration.", benefits: "Reduces transepidermal water loss, leaving skin supple, resilient, and deeply moisturized.", howItWorks: "Acts as a humectant to draw in moisture, and an emollient to seal cracks in the skin barrier.", usageNotes: "A fantastic buffer ingredient—use it to calm the skin when incorporating strong retinoids." },
      { name: "Ceramides", icon: "🧱", description: "Restores the skin's natural protective barrier, preventing moisture loss.", benefits: "Rebuilds the skin's defensive layer against environmental damage and dehydration.", howItWorks: "These are lipid molecules that fill the gaps between skin cells, acting like mortar in a brick wall.", usageNotes: "Found in most barrier-repair moisturizers. Crucial during winter or when skin feels 'tight'." }
    ],
    content: (
      <div className="space-y-4 text-sm text-text-muted leading-relaxed">
        <p>While mainstream stars like Vitamin C and Retinol get all the glory, there are several "hidden heroic" ingredients that can quietly transform your skin—often with less irritation.</p>
        <p><strong>The Unsung Heroes:</strong></p>
        <ul className="list-disc pl-5 space-y-3">
          <li>
            <strong>Centella Asiatica (Cica / Tiger Grass):</strong> A legendary soothing herb. Legend says tigers roll in it to heal their wounds. It is incredible for repairing a damaged skin barrier and calming intense redness or irritation.
          </li>
          <li>
            <strong>Azelaic Acid:</strong> A highly underrated multi-tasker. It gently exfoliates, has antibacterial properties (great for acne), and is incredibly effective at halting melanin production to fade post-acne marks (PIH) and melasma.
          </li>
          <li>
            <strong>Snail Mucin (Snail Secretion Filtrate):</strong> It might sound strange, but it is a powerhouse of hydration and repair. It gives a plump, "glass-skin" effect without clogging pores.
          </li>
          <li>
            <strong>Panthenol (Pro-Vitamin B5):</strong> Acts as both a humectant (drawing in water) and an emollient (smoothing the skin). It's fantastic for soothing stressed, angry skin.
          </li>
          <li>
            <strong>Ceramides:</strong> Think of your skin cells as bricks; ceramides are the mortar holding them together. Replenishing them is vital for a healthy, defensive skin barrier.
          </li>
        </ul>
        <div className="bg-primary-light p-4 rounded-xl border border-primary/30 text-primary-dark">
          <p className="font-semibold mb-1 flex items-center gap-2"><CheckCircle2 size={16}/> Pro Tip</p>
          <p>These ingredients are excellent "buffers" to use alongside harsh actives like retinoids or strong direct acids to minimize potential irritation and peeling.</p>
        </div>
      </div>
    )
  }
];

export interface RoutineList {
  id: string;
  name: string;
  steps: RoutineStep[];
}

const DEFAULT_ROUTINES: RoutineList[] = [
  {
    id: 'r1',
    name: 'Daily Regimen',
    steps: [
      { id: 'm1', time: 'morning', step: 1, name: 'Gentle Cleanser', description: 'Wash away overnight sweat and prep skin.', completed: false },
      { id: 'm2', time: 'morning', step: 2, name: 'Vitamin C Serum', description: 'Antioxidant protection against free radicals and brightens dark spots.', completed: false },
      { id: 'm3', time: 'morning', step: 3, name: 'Moisturizer', description: 'Hydrate the skin barrier.', completed: false },
      { id: 'm4', time: 'morning', step: 4, name: 'Sunscreen (SPF 30+)', description: 'Crucial for preventing further dark spots and tanning.', completed: false },
      
      { id: 'n1', time: 'night', step: 1, name: 'Double Cleanse', description: 'Oil cleanser followed by water-based to remove waterproof SPF.', completed: false },
      { id: 'n2', time: 'night', step: 2, name: 'Treatment (AHA/BHA)', description: 'Exfoliate dead cells and encourage cell turnover (2-3x/week).', completed: false },
      { id: 'n3', time: 'night', step: 3, name: 'Rich Moisturizer', description: 'Support overnight recovery and lock in treatment.', completed: false },
    ]
  },
  {
    id: 'r2',
    name: 'Weekend (Sensitive Skin)',
    steps: [
      { id: 'sm1', time: 'morning', step: 1, name: 'Water Rinse', description: 'Skip cleanser, use lukewarm water.', completed: false },
      { id: 'sm2', time: 'morning', step: 2, name: 'Soothing Toner', description: 'Apply a calming essence.', completed: false },
      { id: 'sm3', time: 'morning', step: 3, name: 'Barrier Cream', description: 'Lock in moisture.', completed: false },
      { id: 'sm4', time: 'morning', step: 4, name: 'Sunscreen', description: 'Protect from UV.', completed: false },
      { id: 'sn1', time: 'night', step: 1, name: 'Mild Cleanser', description: 'Cleanse without stripping.', completed: false },
      { id: 'sn2', time: 'night', step: 2, name: 'Hydrating Serum', description: 'Use Panthenol or HA.', completed: false },
      { id: 'sn3', time: 'night', step: 3, name: 'Thick Moisturizer', description: 'Apply a generous layer of Cica cream.', completed: false },
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('knowledge');
  const [routines, setRoutines] = useState<RoutineList[]>(DEFAULT_ROUTINES);
  const [activeRoutineId, setActiveRoutineId] = useState<string>(DEFAULT_ROUTINES[0].id);
  const [isEditingRoutine, setIsEditingRoutine] = useState(false);
  const [isCreatingRoutine, setIsCreatingRoutine] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newStepName, setNewStepName] = useState('');
  const [newStepDesc, setNewStepDesc] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [assistantInput, setAssistantInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [skinType, setSkinType] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<{data: string, mimeType: string, url: string} | null>(null);
  const [videoResult, setVideoResult] = useState<any>(null);
  const [visualizerInput, setVisualizerInput] = useState('');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const tabs = [
    { id: 'assistant', label: 'AI Assistant', icon: <Sparkles size={20} /> },
    { id: 'routine', label: 'My Routine', icon: <Droplets size={20} /> },
    { id: 'visualizer', label: 'Visualizer', icon: <Video size={20} /> },
    { id: 'knowledge', label: 'Knowledge', icon: <BookOpen size={20} /> },
  ] as const;

  const handleGenerateVideo = async () => {
    if (!visualizerInput.trim()) return;
    setIsGeneratingVideo(true);
    setVideoResult(null);

    setGenerationStep('Analyzing treatment plan...');
    await new Promise(r => setTimeout(r, 1000));
    setGenerationStep('Generating storyboard frames...');
    await new Promise(r => setTimeout(r, 1500));
    setGenerationStep('Applying AI style transfer...');
    await new Promise(r => setTimeout(r, 1500));

    setVideoResult({
      title: visualizerInput,
      beforeImg: "https://images.unsplash.com/photo-1544161513-01f14fa036eb?auto=format&fit=crop&q=80&w=500",
      afterImg: "https://images.unsplash.com/photo-1616683824599-0143899723ec?auto=format&fit=crop&q=80&w=500",
      script: [
        "Day 1: The skin barrier might be compromised, showing signs of dullness or uneven texture.",
        "Week 4: As active ingredients increase cell turnover, the skin begins to smooth out.",
        "Week 8: Visible reduction in texture, revealing a natural, healthy glow and improved elasticity."
      ]
    });
    setIsGeneratingVideo(false);
    setGenerationStep('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const [meta, data] = base64String.split(',');
        const mimeType = meta.split(':')[1].split(';')[0];
        setSelectedImage({ data, mimeType, url: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof localStorage !== 'undefined') {
      return (localStorage.getItem('pinakicare_theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('pinakicare_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleAskAssistant = async () => {
    if (!assistantInput.trim() && !selectedImage) return;
    setIsAnalyzing(true);
    setAiResponse('');
    
    try {
      const knowledgeContext = ARTICLES.map(a => `${a.title}: ${a.textContent}`).join('\n\n');
      const skinTypeContext = skinType ? `The user's skin type is ${skinType}. ` : '';
      
      const parts: any[] = [];
      if (selectedImage) {
        parts.push({
          inlineData: {
            mimeType: selectedImage.mimeType,
            data: selectedImage.data
          }
        });
      }
      
      const promptText = assistantInput
        ? `${skinTypeContext}User concern/input: ${assistantInput}\n\nRelevant knowledge base:\n${knowledgeContext}`
        : `${skinTypeContext}Analyze this image of the user's skin. Identify any visible concerns (like redness, acne, dryness, hyperpigmentation) and suggest a targeted routine. Mention any relevant concepts from the knowledge base.\n\nRelevant knowledge base:\n${knowledgeContext}`;
        
      parts.push({ text: promptText });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: { parts },
        config: {
          systemInstruction: "You are a professional skincare assistant for the 'Pinakicare' app. Analyze provided images for skin concerns (like redness, dry patches, acne) if present. Use the provided knowledge base to answer the user's skin concern. Be empathetic, practical, and concise. Provide actionable advice formatted in markdown. Tailor your advice specifically to the user's skin type if provided. If the knowledge base doesn't cover it fully, give general good skincare advice.",
        }
      });
      
      setAiResponse(response.text || 'Sorry, I could not generate a response.');
    } catch (error) {
      console.error(error);
      setAiResponse('An error occurred while analyzing your concern. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const [routineTime, setRoutineTime] = useState<'morning' | 'night'>('morning');

  const activeRoutine = routines.find(r => r.id === activeRoutineId) || routines[0];

  const toggleRoutineStep = (id: string) => {
    setRoutines(prev => prev.map(r => {
      if (r.id === activeRoutineId) {
        return {
          ...r,
          steps: r.steps.map(step => 
            step.id === id ? { ...step, completed: !step.completed } : step
          )
        };
      }
      return r;
    }));
  };

  const deleteRoutineStep = (id: string) => {
    setRoutines(prev => prev.map(r => {
      if (r.id === activeRoutineId) {
        return { ...r, steps: r.steps.filter(step => step.id !== id) };
      }
      return r;
    }));
  };

  const addRoutineStep = (time: 'morning' | 'night') => {
    if (!newStepName.trim()) return;
    setRoutines(prev => prev.map(r => {
      if (r.id === activeRoutineId) {
        const newStep: RoutineStep = {
          id: Date.now().toString(),
          time,
          step: r.steps.filter(s => s.time === time).length + 1,
          name: newStepName,
          description: newStepDesc,
          completed: false
        };
        return { ...r, steps: [...r.steps, newStep] };
      }
      return r;
    }));
    setNewStepName('');
    setNewStepDesc('');
  };

  const createNewRoutine = () => {
    if (!newRoutineName.trim()) return;
    const newRoutine: RoutineList = {
      id: Date.now().toString(),
      name: newRoutineName,
      steps: []
    };
    setRoutines([...routines, newRoutine]);
    setActiveRoutineId(newRoutine.id);
    setNewRoutineName('');
    setIsCreatingRoutine(false);
    setIsEditingRoutine(true);
  };

  const deleteRoutine = (id: string) => {
    if (routines.length <= 1) return;
    const updated = routines.filter(r => r.id !== id);
    setRoutines(updated);
    if (activeRoutineId === id) {
      setActiveRoutineId(updated[0].id);
    }
  };

  const morningRoutine = activeRoutine.steps.filter(s => s.time === 'morning');
  const nightRoutine = activeRoutine.steps.filter(s => s.time === 'night');

  const morningProgress = morningRoutine.length ? morningRoutine.filter(s => s.completed).length / morningRoutine.length : 0;
  const nightProgress = nightRoutine.length ? nightRoutine.filter(s => s.completed).length / nightRoutine.length : 0;

  const filteredArticles = ARTICLES.filter(article => {
    const query = searchQuery.toLowerCase();
    return article.title.toLowerCase().includes(query) || 
           article.category.toLowerCase().includes(query) ||
           article.textContent.toLowerCase().includes(query);
  });

  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-light/40 via-background to-accent-peach/20 dark:from-primary-light/10 dark:via-background dark:to-accent-peach/5 flex flex-col font-sans transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary-dark">
            <Sparkles size={24} className="text-primary" />
            <h1 className="font-serif text-xl font-bold tracking-tight">Pinakicare</h1>
          </div>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-primary-light/50 text-text-muted hover:text-primary transition-colors focus:outline-none"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-8 pb-24">
        
        {/* Navigation Tabs */}
        <div className="flex bg-surface p-1 rounded-2xl border border-border mb-8 shadow-sm">
          {(['knowledge', 'routine', 'assistant', 'visualizer'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSelectedArticle(null); }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl capitalize transition-all duration-200 ${
                activeTab === tab 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-text-muted hover:bg-primary-light/30'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          
          {/* Knowledge Base Tab */}
          {activeTab === 'knowledge' && (
            <motion.div
              key="knowledge"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {!selectedArticle ? (
                <>
                  <div className="mb-6">
                    <h2 className="font-serif text-2xl font-bold text-text-main mb-2">Learn About Your Skin</h2>
                    <p className="text-text-muted text-sm">Expert-backed advice on treating common concerns.</p>
                  </div>
                  
                  <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={18} className="text-text-muted" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl bg-surface text-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="space-y-4">
                    {filteredArticles.length > 0 ? filteredArticles.map(article => (
                      <button 
                        key={article.id}
                        onClick={() => setSelectedArticle(article)}
                        className="w-full bg-surface p-5 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow text-left group"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="p-3 bg-background rounded-xl border border-border group-hover:bg-primary-light/50 transition-colors">
                            {article.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-text-main mb-1 group-hover:text-primary transition-colors">{article.title}</h3>
                            <div className="flex items-center gap-3 text-xs font-medium text-text-muted">
                              <span className="bg-background px-2 py-1 rounded-md border border-border">{article.category}</span>
                              <span>{article.readTime}</span>
                            </div>
                          </div>
                          <ChevronRight className="text-border group-hover:text-primary transition-colors mt-2" size={20} />
                        </div>
                      </button>
                    )) : (
                      <div className="text-center py-10 bg-surface rounded-2xl border border-border border-dashed">
                        <Search size={32} className="mx-auto text-border mb-3" />
                        <h3 className="font-semibold text-text-main mb-1">No articles found</h3>
                        <p className="text-sm text-text-muted">Try adjusting your search terms.</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden"
                >
                  <div className="p-6">
                    <button 
                      onClick={() => setSelectedArticle(null)}
                      className="text-sm font-semibold text-primary hover:text-primary-dark mb-6 inline-flex items-center gap-1"
                    >
                      &larr; Back to articles
                    </button>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-primary-light rounded-lg">
                        {selectedArticle.icon}
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-primary-dark">
                        {selectedArticle.category}
                      </span>
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-text-main mb-6 leading-tight">
                      {selectedArticle.title}
                    </h2>
                    <div className="prose prose-sm prose-stone">
                      {selectedArticle.content}
                    </div>
                    {selectedArticle.ingredients && selectedArticle.ingredients.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-border">
                        <h3 className="text-lg font-bold text-text-main flex items-center gap-2 mb-4">
                          <Sparkles size={18} className="text-primary-dark" />
                          Key Ingredients Highlight
                        </h3>
                        <div className="grid gap-4">
                          {selectedArticle.ingredients.map((ing, idx) => (
                            <div key={idx} className="flex gap-4 bg-background border border-border p-5 rounded-xl transition-all hover:border-primary/40 hover:shadow-sm">
                              <div className="text-3xl pt-1 shrink-0">{ing.icon}</div>
                              <div className="flex-1 space-y-4">
                                <div>
                                  <h4 className="font-bold text-text-main text-base">{ing.name}</h4>
                                  <p className="text-sm font-medium text-primary-dark">{ing.description}</p>
                                </div>
                                <div className="grid gap-3 text-sm text-text-muted">
                                  {ing.benefits && (
                                    <div className="bg-surface/50 p-3.5 rounded-lg border border-border/50">
                                      <strong className="text-text-main block mb-1">Benefits</strong>
                                      <p className="leading-relaxed">{ing.benefits}</p>
                                    </div>
                                  )}
                                  {ing.howItWorks && (
                                    <div className="bg-surface/50 p-3.5 rounded-lg border border-border/50">
                                      <strong className="text-text-main block mb-1">How it Works</strong>
                                      <p className="leading-relaxed">{ing.howItWorks}</p>
                                    </div>
                                  )}
                                  {ing.usageNotes && (
                                    <div className="bg-surface/50 p-3.5 rounded-lg border border-border/50">
                                      <strong className="text-text-main block mb-1">Usage Notes</strong>
                                      <p className="leading-relaxed">{ing.usageNotes}</p>
                                    </div>
                                  )}
                                </div>
                                <button
                                  onClick={() => {
                                    setActiveTab('assistant');
                                    setAssistantInput(`Can you provide a deeper analysis of ${ing.name}, including potential interactions with other ingredients and personalized recommendations based on my skin type?`);
                                  }}
                                  className="mt-2 text-xs font-semibold text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-lg active:scale-95"
                                >
                                  <Sparkles size={14} /> Ask AI about {ing.name}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <FeedbackWidget />
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Routine Tab */}
          {activeTab === 'routine' && (
            <motion.div
              key="routine"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-text-main mb-2">My Routines</h2>
                    <p className="text-text-muted text-sm">Organize and track your skincare regimens.</p>
                  </div>
                  <button 
                    onClick={() => setIsEditingRoutine(!isEditingRoutine)}
                    className="text-sm font-medium text-primary bg-primary-light/50 px-3 py-1.5 rounded-lg hover:bg-primary-light transition-colors"
                  >
                    {isEditingRoutine ? 'Done Editing' : 'Edit Routine'}
                  </button>
                </div>
                
                {/* Routine Selector Row */}
                <div className="flex gap-3 mb-4 overflow-x-auto pb-2 scrollbar-none items-center">
                  {routines.map(r => (
                    <div key={r.id} className="relative group shrink-0">
                      <button
                        onClick={() => setActiveRoutineId(r.id)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${
                          activeRoutineId === r.id 
                            ? 'bg-text-main text-white border-text-main shadow-sm' 
                            : 'bg-surface text-text-muted border-border hover:border-text-muted hover:text-text-main'
                        }`}
                      >
                        {r.name}
                      </button>
                      {isEditingRoutine && routines.length > 1 && activeRoutineId === r.id && (
                        <button 
                          onClick={() => deleteRoutine(r.id)}
                          className="absolute -top-1 -right-1 bg-accent-rose text-accent-rose-dark rounded-full p-0.5 border border-white hover:bg-accent-rose-dark hover:text-white"
                          title="Delete Routine"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  {isCreatingRoutine ? (
                    <div className="flex items-center gap-2 shrink-0 ml-1">
                      <input 
                        autoFocus
                        type="text" 
                        value={newRoutineName}
                        onChange={e => setNewRoutineName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && createNewRoutine()}
                        placeholder="Routine Name..."
                        className="px-3 py-1.5 rounded-full text-sm font-medium border border-border focus:outline-none focus:border-primary shadow-sm bg-surface w-36 text-text-main"
                      />
                      <button onClick={createNewRoutine} className="text-primary hover:text-primary-dark p-1">
                        <CheckCircle2 size={18} />
                      </button>
                      <button onClick={() => setIsCreatingRoutine(false)} className="text-text-muted hover:text-accent-rose p-1">
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setIsCreatingRoutine(true)}
                      className="px-4 py-2 rounded-full text-sm font-semibold border-2 border-dashed border-border text-text-muted hover:border-primary hover:text-primary transition-all shrink-0 flex items-center gap-1.5"
                    >
                      <Sparkles size={14} /> New
                    </button>
                  )}
                </div>
              </div>

              {/* Segmented Control for Morning/Night */}
              <div className="flex bg-surface p-1 rounded-xl border border-border mb-6 shadow-sm">
                <button
                  onClick={() => setRoutineTime('morning')}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${
                    routineTime === 'morning' 
                      ? 'bg-accent-peach-dark text-white shadow-sm' 
                      : 'text-text-muted hover:bg-accent-peach/30'
                  }`}
                >
                  <Sun size={16} /> Morning
                </button>
                <button
                  onClick={() => setRoutineTime('night')}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${
                    routineTime === 'night' 
                      ? 'bg-indigo-500 text-white shadow-sm' 
                      : 'text-text-muted hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                  }`}
                >
                  <Moon size={16} /> Night
                </button>
              </div>

              <div className="space-y-8">
                <AnimatePresence mode="wait">
                  {routineTime === 'morning' ? (
                    <motion.section
                      key="morning-routine"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold flex items-center gap-2 text-text-main">
                          Morning Sequence
                        </h3>
                        <div className="text-xs font-semibold text-text-muted bg-surface px-3 py-1 rounded-full border border-border">
                          {Math.round(morningProgress * 100)}% Done
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="h-2 w-full bg-border rounded-full overflow-hidden mb-4">
                        <motion.div 
                          className="h-full bg-accent-peach-dark"
                          initial={{ width: 0 }}
                          animate={{ width: `${morningProgress * 100}%` }}
                        />
                      </div>

                      <div className="space-y-3">
                        {morningRoutine.length === 0 && !isEditingRoutine && (
                          <p className="text-sm text-text-muted text-center py-4 italic">No steps added for morning yet.</p>
                        )}
                        {morningRoutine.map((item) => (
                          <div key={item.id} className="flex gap-2 items-center">
                            <div className="flex-1">
                              <RoutineItem 
                                item={item} 
                                onToggle={() => toggleRoutineStep(item.id)} 
                              />
                            </div>
                            {isEditingRoutine && (
                              <button onClick={() => deleteRoutineStep(item.id)} className="p-2 text-text-muted hover:text-accent-rose-dark rounded-lg hover:bg-accent-rose/50 transition-colors">
                                <X size={20} />
                              </button>
                            )}
                          </div>
                        ))}
                        {isEditingRoutine && (
                          <div className="mt-4 p-4 border border-dashed border-border rounded-xl bg-surface/50">
                            <h4 className="text-sm font-bold text-text-main mb-3">Add Morning Step</h4>
                            <div className="space-y-3 relative z-20">
                              <input 
                                type="text"
                                placeholder="Step Name (e.g., Vitamin C)"
                                value={newStepName}
                                onChange={e => setNewStepName(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:border-primary text-text-main"
                              />
                              <input 
                                type="text"
                                placeholder="Description (optional)"
                                value={newStepDesc}
                                onChange={e => setNewStepDesc(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:border-primary text-text-main"
                              />
                              <button 
                                onClick={() => addRoutineStep('morning')}
                                disabled={!newStepName.trim()}
                                className="w-full py-2 bg-primary/10 text-primary hover:bg-primary/20 font-bold text-sm rounded-lg transition-colors disabled:opacity-50"
                              >
                                Add Step
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.section>
                  ) : (
                    <motion.section
                      key="night-routine"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold flex items-center gap-2 text-text-main">
                          Evening Sequence
                        </h3>
                        <div className="text-xs font-semibold text-text-muted bg-surface px-3 py-1 rounded-full border border-border">
                          {Math.round(nightProgress * 100)}% Done
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="h-2 w-full bg-border rounded-full overflow-hidden mb-4">
                        <motion.div 
                          className="h-full bg-indigo-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${nightProgress * 100}%` }}
                        />
                      </div>

                      <div className="space-y-3">
                        {nightRoutine.length === 0 && !isEditingRoutine && (
                          <p className="text-sm text-text-muted text-center py-4 italic">No steps added for evening yet.</p>
                        )}
                        {nightRoutine.map((item) => (
                          <div key={item.id} className="flex gap-2 items-center">
                            <div className="flex-1">
                              <RoutineItem 
                                item={item} 
                                onToggle={() => toggleRoutineStep(item.id)} 
                              />
                            </div>
                            {isEditingRoutine && (
                              <button onClick={() => deleteRoutineStep(item.id)} className="p-2 text-text-muted hover:text-accent-rose-dark rounded-lg hover:bg-accent-rose/50 transition-colors">
                                <X size={20} />
                              </button>
                            )}
                          </div>
                        ))}
                        {isEditingRoutine && (
                          <div className="mt-4 p-4 border border-dashed border-border rounded-xl bg-surface/50">
                            <h4 className="text-sm font-bold text-text-main mb-3">Add Evening Step</h4>
                            <div className="space-y-3 relative z-20">
                              <input 
                                type="text"
                                placeholder="Step Name (e.g., Retinol)"
                                value={newStepName}
                                onChange={e => setNewStepName(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:border-indigo-500 text-text-main"
                              />
                              <input 
                                type="text"
                                placeholder="Description (optional)"
                                value={newStepDesc}
                                onChange={e => setNewStepDesc(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:border-indigo-500 text-text-main"
                              />
                              <button 
                                onClick={() => addRoutineStep('night')}
                                disabled={!newStepName.trim()}
                                className="w-full py-2 bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 font-bold text-sm rounded-lg transition-colors disabled:opacity-50"
                              >
                                Add Step
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.section>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Virtual Assistant / Analyzer Tab */}
          {activeTab === 'assistant' && (
            <motion.div
              key="assistant"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <h2 className="font-serif text-2xl font-bold text-text-main mb-2">Skin Analyzer</h2>
                <p className="text-text-muted text-sm">Get personalized tips based on your primary concern.</p>
              </div>

              <div className="bg-primary p-6 rounded-2xl text-white shadow-md mb-6 relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 opacity-10">
                  <Sparkles size={200} />
                </div>
                <div className="max-w-[80%] md:max-w-full relative z-10">
                  <h3 className="font-bold text-lg mb-2">How is your skin feeling today?</h3>
                  <p className="text-primary-light text-sm mb-4">Describe your concern, or select a quick option below.</p>
                  
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap gap-2 mb-1">
                      {[
                        { id: 'oily', label: 'Oily', tooltip: 'Produces excess sebum, looks shiny.' },
                        { id: 'dry', label: 'Dry', tooltip: 'Flaky, rough, or tight feeling.' },
                        { id: 'combination', label: 'Combination', tooltip: 'Oily T-zone, dry/normal cheeks.' },
                        { id: 'sensitive', label: 'Sensitive', tooltip: 'Prone to redness, stinging, or irritation.' },
                        { id: 'normal', label: 'Normal', tooltip: 'Balanced, few imperfections.' }
                      ].map(type => (
                        <button
                          key={type.id}
                          onClick={() => setSkinType(skinType === type.id ? '' : type.id)}
                          title={type.tooltip}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                            skinType === type.id 
                              ? 'bg-primary border-white text-white shadow-sm' 
                              : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20 hover:text-white'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>

                    {selectedImage && (
                      <div className="relative inline-block w-20 h-20 mb-2">
                        <img src={selectedImage.url} alt="Skin preview" className="w-full h-full object-cover rounded-lg border-2 border-white/20" />
                        <button 
                          onClick={() => setSelectedImage(null)}
                          className="absolute -top-2 -right-2 bg-text-main text-white rounded-full p-1 shadow-sm hover:scale-105 transition-transform"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                    <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-xl border border-white/20 focus-within:bg-white/20 transition-colors">
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors shrink-0"
                        title="Upload a photo for analysis"
                      >
                        <Camera size={20} />
                      </button>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                      />
                      <input
                        type="text"
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/60 px-2 text-sm"
                        placeholder="e.g. Analyze my skin from this photo..."
                        value={assistantInput}
                        onChange={(e) => setAssistantInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAskAssistant()}
                      />
                      <button
                        onClick={handleAskAssistant}
                        disabled={isAnalyzing || (!assistantInput.trim() && !selectedImage)}
                        className="bg-white text-primary rounded-xl px-4 py-2 flex items-center justify-center disabled:opacity-50 transition-opacity hover:bg-primary-light focus:outline-none shrink-0"
                      >
                        {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {aiResponse ? (
                  <motion.div
                    key="ai-response"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-surface border border-border p-6 rounded-2xl shadow-sm mb-6"
                  >
                    <div className="flex items-center gap-2 mb-4 text-primary-dark border-b border-border pb-4">
                      <Sparkles size={18} className="text-primary"/> 
                      <h3 className="font-bold text-lg">AI Recommendation</h3>
                    </div>
                    <div className="prose prose-sm prose-stone">
                      <Markdown>{aiResponse}</Markdown>
                    </div>
                    <FeedbackWidget />
                    <button 
                      onClick={() => { setAiResponse(''); setAssistantInput(''); setSelectedImage(null); }}
                      className="mt-6 text-sm font-semibold text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1 focus:outline-none"
                    >
                      &larr; Ask another question
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="concern-cards" 
                    className="grid grid-cols-2 gap-4"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                  >
                    {[
                      { id: 'dark-spots', label: 'Dark Spots', icon: '🎯' },
                      { id: 'dullness', label: 'Tanning & Dullness', icon: '☀️' },
                      { id: 'dryness', label: 'Dry & Flaky', icon: '💧' },
                      { id: 'acne', label: 'Breakouts', icon: '🌋' }
                    ].map(concern => (
                      <button 
                        key={concern.id}
                        onClick={() => {
                          setAssistantInput(`I am struggling with ${concern.label.toLowerCase()}. What should I do?`);
                        }}
                        className="bg-surface border border-border p-5 rounded-2xl flex flex-col items-center justify-center text-center hover:shadow-sm hover:border-primary/40 transition-all shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] focus:outline-none"
                      >
                        <span className="text-3xl mb-3 block">{concern.icon}</span>
                        <span className="font-semibold text-text-main mb-2">{concern.label}</span>
                        <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider mt-1">
                          Click to ask
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          )}

          {/* Visualizer Tab */}
          {activeTab === 'visualizer' && (
            <motion.div
              key="visualizer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-primary text-white p-6 rounded-2xl mb-6 relative overflow-hidden shadow-sm">
                <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
                  <Video size={120} />
                </div>
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold font-serif mb-2">AI Results Visualizer</h2>
                  <p className="text-primary-light text-sm mb-4">
                    Wait time could be real! Predict how your skin will improve after consistent care using short mock visualizations.
                  </p>
                  
                  <div className="flex flex-col gap-3">
                    <textarea
                      className="bg-white/10 text-white text-sm rounded-xl px-4 py-3 border border-white/20 focus:outline-none focus:bg-white/20 transition-colors w-full resize-none placeholder-white/60"
                      rows={2}
                      placeholder="e.g., Using Niacinamide and Vitamin C for dark spots over 8 weeks..."
                      value={visualizerInput}
                      onChange={(e) => setVisualizerInput(e.target.value)}
                    />
                    <button
                      onClick={handleGenerateVideo}
                      disabled={isGeneratingVideo || !visualizerInput.trim()}
                      className="bg-white text-primary rounded-xl px-4 py-3 font-semibold flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed transition-all hover:bg-primary-light shadow-sm"
                    >
                      {isGeneratingVideo ? (
                        <>
                          <Loader2 size={18} className="animate-spin" /> 
                          {generationStep}
                        </>
                      ) : (
                        <>
                          <Video size={18} /> Generate Visualization
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {videoResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm"
                >
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-semibold text-text-main flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-primary" />
                      Generated Visualization
                    </h3>
                    <span className="text-xs font-medium text-text-muted bg-background px-2 py-1 rounded">Interactive Slide</span>
                  </div>
                  
                  <div className="p-4">
                    <BeforeAfterSlider beforeUrl={videoResult.beforeImg} afterUrl={videoResult.afterImg} />
                    
                    <div className="mt-6 space-y-4">
                      <h4 className="text-sm font-bold text-text-main uppercase tracking-wider">Projected Timeline</h4>
                      <div className="border-l-2 border-border pl-4 space-y-4">
                        {videoResult.script.map((line: string, i: number) => (
                          <div key={i} className="relative">
                            <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-surface" />
                            <p className="text-sm text-text-muted leading-relaxed">{line}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Watermark/Footer */}
      <footer className="mt-auto py-6 flex flex-col items-center justify-center border-t border-border/50 bg-surface/50">
        <div className="flex items-center gap-2 text-text-muted pb-1">
          <Sparkles size={14} className="text-primary/70" />
          <span className="text-xs font-semibold tracking-wider uppercase text-primary-dark/70">Pinakicare</span>
        </div>
        <p className="text-[11px] font-medium text-text-muted/70 tracking-wide">
          Created by <span className="text-primary-dark/80 font-bold">Anshuman Gupta</span>
        </p>
      </footer>
    </div>
  );
}

// Subcomponents

function RoutineItem({ item, onToggle }: { item: RoutineStep, onToggle: () => void }) {
  return (
    <motion.button 
      onClick={onToggle}
      layout
      animate={{
        opacity: item.completed ? 0.6 : 1,
        scale: item.completed ? 0.98 : 1,
      }}
      transition={{ duration: 0.2 }}
      className={`w-full flex items-start gap-4 p-4 rounded-2xl border text-left transition-colors ${
        item.completed 
          ? 'bg-primary-light border-primary-light' 
          : 'bg-surface border-border hover:shadow-sm'
      }`}
    >
      <div className={`relative mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
        item.completed ? 'bg-primary border-primary' : 'border-border'
      }`}>
        <AnimatePresence>
          {item.completed && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <CheckCircle2 size={14} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-text-muted">STEP {item.step}</span>
          <span className={`font-semibold transition-colors ${item.completed ? 'text-primary-dark line-through decoration-primary-dark/30' : 'text-text-main'}`}>
            {item.name}
          </span>
        </div>
        <p className={`text-sm transition-colors ${item.completed ? 'text-primary-dark/80' : 'text-text-muted'}`}>
          {item.description}
        </p>
      </div>
    </motion.button>
  );
}



function FeedbackWidget({ compact = false }: { compact?: boolean }) {
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null);

  if (feedback) {
    return (
      <div className={`${compact ? 'mt-3 p-2 text-[10px]' : 'mt-6 p-3 text-xs'} bg-primary-light/50 border border-primary-light rounded-lg text-primary-dark font-medium text-center`}>
        Thank you for your feedback!
      </div>
    );
  }

  return (
    <div className={`${compact ? 'mt-3 pt-3' : 'mt-6 pt-4'} flex flex-col items-center gap-2 border-t border-border w-full`}>
      <span className={`${compact ? 'text-xs' : 'text-sm'} font-medium text-text-muted`}>Was this helpful?</span>
      <div className="flex gap-2">
        <button 
          onClick={(e) => { e.stopPropagation(); setFeedback('yes'); }}
          className={`px-3 py-1.5 rounded-full border border-border ${compact ? 'text-[11px]' : 'text-sm'} font-medium hover:bg-primary-light hover:text-primary-dark hover:border-primary-light transition-colors`}
        >
          Yes
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); setFeedback('no'); }}
          className={`px-3 py-1.5 rounded-full border border-border ${compact ? 'text-[11px]' : 'text-sm'} font-medium hover:bg-accent-rose hover:text-accent-rose-dark hover:border-accent-rose transition-colors`}
        >
          No
        </button>
      </div>
    </div>
  );
}

function BeforeAfterSlider({ beforeUrl, afterUrl }: { beforeUrl: string, afterUrl: string }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    let clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    // ensure percent is between 0 and 100
    const percent = Math.min(Math.max(((clientX - left) / width) * 100, 0), 100);
    setSliderPosition(percent);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden cursor-ew-resize select-none touch-none bg-border"
      onMouseMove={(e) => e.buttons === 1 && handleMove(e)}
      onTouchMove={handleMove}
      onMouseDown={handleMove}
    >
      {/* After image (background) */}
      <img src={afterUrl} alt="After" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
      
      {/* Labels */}
      <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded backdrop-blur-sm z-20">Before</div>
      <div className="absolute top-3 right-3 bg-black/60 text-primary-light text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded backdrop-blur-sm z-0">After</div>

      {/* Before image (clipped) */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden border-r-[3px] border-white z-10 pointer-events-none shadow-[2px_0_10px_rgba(0,0,0,0.2)]"
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        <img src={beforeUrl} alt="Before" className="absolute inset-0 w-full h-full object-cover max-w-none" style={{ width: '100%' }} />
      </div>
      
      {/* Slider handle */}
      <div 
        className="absolute top-0 bottom-0 w-0 z-20 flex items-center justify-center pointer-events-none drop-shadow-md"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border border-border">
          <div className="flex gap-[3px]">
            <div className="w-0.5 h-3 bg-text-muted rounded-full"></div>
            <div className="w-0.5 h-3 bg-text-muted rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}


