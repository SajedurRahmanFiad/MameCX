/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Brand,
  KnowledgeDocument,
  BrandRule,
  TrainingExample,
  StyleExample,
  PromptConfig,
  FacebookConfig,
  ProductItem,
  Conversation,
  Customer,
  DashboardUser,
  CashTransaction,
  SystemHealthStatus,
  ServerLogEntry,
  SecretKey,
  AuditLogEntry,
  BackgroundJob,
  DashboardSettings
} from './types';

export const initialBrands: Brand[] = [
  {
    id: 'b1',
    name: 'AeroGadget Store',
    slug: 'aerogadget',
    defaultLanguage: 'English',
    tone: 'Professional, Tech-savvy, reassuring',
    handoffMessage: 'I will put you in touch with our tech support engineering team immediately. One of our engineers will take over here shortly!',
    llmProvider: 'Google Gemini',
    llmModel: 'gemini-2.5-flash',
    apiKeySet: true,
    active: true,
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'b2',
    name: 'Luminary Skin Care',
    slug: 'luminary-skin',
    defaultLanguage: 'English',
    tone: 'Warm, empathetic, beauty-expert, gentle',
    handoffMessage: 'Connecting you with our Head Esthetician who can personally review your skin concerns. They will chat with you here shortly.',
    llmProvider: 'Google Gemini',
    llmModel: 'gemini-2.5-flash',
    apiKeySet: true,
    active: true,
    createdAt: '2026-02-15T08:30:00Z'
  },
  {
    id: 'b3',
    name: 'Solas Footwear',
    slug: 'solas-footwear',
    defaultLanguage: 'Spanish',
    tone: 'Active, athletic, bold, straightforward',
    handoffMessage: 'Un momento por favor. Te estoy conectando con un especialista en calzado de nuestro equipo para asistirte con tu talla.',
    llmProvider: 'OpenAI',
    llmModel: 'gpt-4o-mini',
    apiKeySet: false,
    active: false,
    createdAt: '2026-05-01T14:20:00Z'
  }
];

export const initialKnowledgeDocs: KnowledgeDocument[] = [
  {
    id: 'kd1',
    brandId: 'b1',
    title: 'AeroDrone X Pro Return & Refund Policy',
    content: 'Customers can return the AeroDrone X Pro within 30 days of receipt. The drone must be returned in its original packaging with all propellers, batteries, and the remote control intact. If the return is due to a hardware defect, AeroGadget pays for return shipping. If it is a change of mind, a $15 restocking fee applies and the customer covers shipping.',
    category: 'Return',
    status: 'indexed',
    updatedAt: '2026-07-10T12:00:00Z'
  },
  {
    id: 'kd2',
    brandId: 'b1',
    title: 'Shipping Times and Customs Info',
    content: 'We ship worldwide. US domestic express shipping takes 2-3 business days. International shipping takes 7-14 business days. Customers in the EU and UK might be subject to import VAT, which is calculated at checkout so there are no surprise fees on delivery. Orders are processed within 24 hours.',
    category: 'Delivery',
    status: 'indexed',
    updatedAt: '2026-07-11T14:30:00Z'
  },
  {
    id: 'kd3',
    brandId: 'b1',
    title: 'AeroDrone X Pro Battery Troubleshooting',
    content: 'If your AeroDrone X Pro battery does not charge: 1. Ensure the temperature is between 5°C and 40°C. 2. Verify that you are using the official 30W USB-C fast charger. 3. Perform a battery reset by pressing and holding the battery power button for 15 seconds while unplugged, then reconnect it to the charger. If the LED status lights flash red, the battery cells have suffered an over-discharge and must be replaced.',
    category: 'FAQ',
    status: 'indexed',
    updatedAt: '2026-07-12T09:15:00Z'
  },
  {
    id: 'kd4',
    brandId: 'b2',
    title: 'Luminary Facial Glow Serum Usage Guide',
    content: 'Apply 3-4 drops of the Facial Glow Serum to a cleansed face and neck morning and evening. Pat gently into the skin instead of rubbing. Follow immediately with our Hydra-Lock Moisturizer to lock in active hyaluronic acid. If you have sensitive skin, start with once daily in the evening for the first week.',
    category: 'Product',
    status: 'indexed',
    updatedAt: '2026-07-08T10:00:00Z'
  },
  {
    id: 'kd5',
    brandId: 'b2',
    title: 'Allergy Concerns and Safe Testing',
    content: 'Our products are paraben-free, sulfate-free, and hypoallergenic. However, we use natural fruit extracts. If you are prone to skin sensitivities, we strongly advise performing a patch test: apply a small drop to your inner wrist or behind the ear lobe and wait 24 hours. If any redness, swelling, or itching occurs, discontinue use and contact us for a full refund under our Skin Satisfaction Guarantee.',
    category: 'Procedure',
    status: 'indexed',
    updatedAt: '2026-07-09T11:20:00Z'
  },
  {
    id: 'kd6',
    brandId: 'b3',
    title: 'Solas Running Shoes Sizing Chart',
    content: 'Our athletic sneakers run slightly narrow to provide stable arch support. We recommend ordering a half-size larger than your standard casual shoe size. For wider feet, please select the Wide (EE) fitting options. Sizing conversion: US 9 = EU 42 (27cm); US 10 = EU 43 (28cm).',
    category: 'Product',
    status: 'pending',
    updatedAt: '2026-07-14T01:00:00Z'
  }
];

export const initialRules: BrandRule[] = [
  {
    id: 'r1',
    brandId: 'b1',
    category: 'Escalation',
    rule: 'Trigger immediate handoff on refund threats or angry swearing.',
    description: 'If the customer demands a refund in an aggressive tone, says they are filing a chargeback, or uses offensive language, set status to handed_off immediately.',
    priority: 'High',
    triggerHandoff: true,
    active: true
  },
  {
    id: 'r2',
    brandId: 'b1',
    category: 'Product Advice',
    rule: 'Never recommend flying drones in heavy rain.',
    description: 'Inform customers that the AeroDrone models have an IPX4 splash resistance rating but are not waterproof. Warn against flying in precipitation or wind exceeding 25 mph.',
    priority: 'Medium',
    triggerHandoff: false,
    active: true
  },
  {
    id: 'r3',
    brandId: 'b2',
    category: 'Medical Disclaimer',
    rule: 'Do not give medical or dermatological diagnoses.',
    description: 'If a customer asks about active eczema flare-ups, severe acne, or skin infections, explicitly state that we are a skincare cosmetics brand, not medical professionals, and recommend consulting a board-certified dermatologist.',
    priority: 'High',
    triggerHandoff: false,
    active: true
  },
  {
    id: 'r4',
    brandId: 'b2',
    category: 'Pricing Negotiation',
    rule: 'Maximum goodwill discount code is 15%.',
    description: 'If a customer is dissatisfied with delivery delays, the chatbot can offer code LUMINARYCARE15 for 15% off their next purchase. Never offer custom cash refunds directly.',
    priority: 'Low',
    triggerHandoff: false,
    active: true
  }
];

export const initialTrainingExamples: TrainingExample[] = [
  {
    id: 'te1',
    brandId: 'b1',
    title: 'Polite Handling of Missing Charger',
    isGlobal: false,
    createdAt: '2026-07-02T15:00:00Z',
    messages: [
      {
        id: 'tem1_1',
        role: 'customer',
        content: 'Hi, I received my AeroDrone yesterday, but the box didn\'t include the 30W USB-C charger. What should I do?',
        timestamp: '2026-07-02T15:00:00Z'
      },
      {
        id: 'tem1_2',
        role: 'assistant',
        content: 'Hello! I am so sorry to hear that your charger was missing from the box. Let\'s get this sorted for you right away. Could you please provide your order number so I can check your packing manifest and ship a replacement charger immediately?',
        timestamp: '2026-07-02T15:01:00Z'
      },
      {
        id: 'tem1_3',
        role: 'customer',
        content: 'Order number is AG-99482. Thank you.',
        timestamp: '2026-07-02T15:01:30Z'
      },
      {
        id: 'tem1_4',
        role: 'assistant',
        content: 'Thank you for order number AG-99482! I have located your details and dispatched a replacement 30W USB-C charger. It will be sent via Express delivery, and you will receive tracking information in your email shortly. We sincerely apologize for this packing error!',
        timestamp: '2026-07-02T15:02:15Z'
      }
    ]
  },
  {
    id: 'te2',
    brandId: 'b2',
    title: 'Calming Reaction to Skin Redness',
    isGlobal: false,
    createdAt: '2026-07-05T09:00:00Z',
    messages: [
      {
        id: 'tem2_1',
        role: 'customer',
        content: 'Help! I put on your glow serum and now my cheeks look a bit red and feel warm. Am I allergic?',
        timestamp: '2026-07-05T09:00:00Z'
      },
      {
        id: 'tem2_2',
        role: 'assistant',
        content: 'Please don\'t worry, I am here to help you. First, please gently wash your face with cool water to soothe the skin. Redness and warmth can sometimes occur if you have a sensitive skin barrier, or if you applied it immediately after another strong product. Rest assured, our ingredients are hypoallergenic, but we want to ensure your absolute comfort. Have you used products containing vitamin C or acids before?',
        timestamp: '2026-07-05T09:01:10Z'
      }
    ]
  }
];

export const initialStyleExamples: StyleExample[] = [
  {
    id: 'se1',
    brandId: 'b1',
    title: 'Technical yet accessible tone',
    triggerText: 'My drone won\'t calibrate its compass.',
    idealReply: 'Calibration issues are usually caused by local electromagnetic interference (like being near concrete, rebar, or metal poles). Try moving at least 15 feet away from buildings or metal structures, power the drone on flat grass, and follow the rotational prompts in the app. Let\'s get you back in the air!',
    notes: 'Keep explanations physical and clear, avoid heavy aeronautical slang, and end with a positive outdoor/flying reference.',
    priority: 'High'
  },
  {
    id: 'se2',
    brandId: 'b2',
    title: 'Empathetic Esthetician Greeting',
    triggerText: 'I don\'t know which product fits my oily skin.',
    idealReply: 'Oily skin is beautifully resilient and just needs the right balance of hydration and gentle clarify! Our Pore-Refining Water Gel is specifically formulated to quench your skin\'s thirst without adding heavy oils. Tell me, what does your current morning routine look like?',
    notes: 'Reframe typical skin "complaints" as positive traits, use comforting sensory words (quench, gentle, resilient), and always end with a gentle question.',
    priority: 'Normal'
  }
];

export const initialPromptConfigs: PromptConfig[] = [
  {
    id: 'pc1',
    brandId: 'b1',
    systemPrompt: 'You are the official AI engineering assistant for AeroGadget. You are passionate about robotics, drones, and consumer electronics. You write in active voice, keeping instructions bulleted and direct. Avoid unnecessary greetings once a conversation is established. If a question is outside the scope of drones, batteries, cameras, or accessories listed in the knowledge base, politely inform the customer you cannot help and suggest a relevant tech topic.',
    toneInstructions: 'Use enthusiastic, professional, highly informative, clear English. No exclamation abuse—maximum 2 per reply. Use clean typography and spacing.',
    replyGuidelines: '1. If troubleshooting, list numbered steps.\n2. Always state safety warnings when discussing lithium batteries.\n3. Do not promise specific refund amounts unless authorized in knowledge documents.',
    lastUpdated: '2026-07-13T16:45:00Z'
  },
  {
    id: 'pc2',
    brandId: 'b2',
    systemPrompt: 'You are Luminary Care AI, an empathetic skincare guide. You speak like a nurturing, knowledgeable dermatologist\'s esthetician. Use sensory words like "radiance," "soothe," "barrier," "hydration," "botanicals." Your main goal is to promote safe skincare practices and recommend correct Luminary routines.',
    toneInstructions: 'Extremely polite, warm, attentive, comforting, structured. Use emojis (organic ones like 🌸, 💧, ✨, 🌿) sparingly (max 2 per response).',
    replyGuidelines: '1. Always ask about the customer\'s skin type before recommending complex routines.\n2. Always include a safety reminder to perform a skin patch test.',
    lastUpdated: '2026-07-14T02:10:00Z'
  }
];

export const initialFacebookConfigs: FacebookConfig[] = [
  {
    id: 'fc1',
    brandId: 'b1',
    pageId: '109823485200394',
    pageName: 'AeroGadget Official Page',
    appId: '883921004821034',
    verifyToken: 'aero_secure_webhook_token_2026',
    accessTokenMasked: 'EAAG9...XyZC8ZD',
    isActive: true,
    replyToMessages: true,
    replyToComments: false,
    handoffOnUncertainty: true,
    businessHoursOnly: false,
    replyDelaySeconds: 4,
    serverLabel: 'production-us-east'
  },
  {
    id: 'fc2',
    brandId: 'b2',
    pageId: '204928113421110',
    pageName: 'Luminary Skin Care Global',
    appId: '394821904210332',
    verifyToken: 'luminary_secrets_fb_key_994',
    accessTokenMasked: 'EAAHX...7R42gZD',
    isActive: true,
    replyToMessages: true,
    replyToComments: true,
    handoffOnUncertainty: false,
    businessHoursOnly: true,
    replyDelaySeconds: 1,
    serverLabel: 'production-eu-west'
  }
];

export const initialProductItems: ProductItem[] = [
  {
    id: 'p1',
    brandId: 'b1',
    name: 'AeroDrone X Pro',
    sku: 'AD-XPRO-01',
    category: 'Quadcopter',
    imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=150&auto=format&fit=crop&q=60',
    confidenceThreshold: 0.85,
    isActive: true
  },
  {
    id: 'p2',
    brandId: 'b1',
    name: '30W USB-C Dual Port Fast Charger',
    sku: 'CHG-30W-USBC',
    category: 'Charger',
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=150&auto=format&fit=crop&q=60',
    confidenceThreshold: 0.70,
    isActive: true
  },
  {
    id: 'p3',
    brandId: 'b1',
    name: 'AeroGuard Propeller Shields',
    sku: 'AD-GUARD-SET',
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=150&auto=format&fit=crop&q=60',
    confidenceThreshold: 0.80,
    isActive: true
  },
  {
    id: 'p4',
    brandId: 'b2',
    name: 'Luminary Facial Glow Serum (50ml)',
    sku: 'LUM-SERUM-50',
    category: 'Serum',
    imageUrl: 'https://images.unsplash.com/photo-1608248597481-496100c80836?w=150&auto=format&fit=crop&q=60',
    confidenceThreshold: 0.90,
    isActive: true
  },
  {
    id: 'p5',
    brandId: 'b2',
    name: 'Hydra-Lock Ultra Moisturizer',
    sku: 'LUM-MOIST-100',
    category: 'Moisturizer',
    imageUrl: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=150&auto=format&fit=crop&q=60',
    confidenceThreshold: 0.85,
    isActive: true
  }
];

export const initialConversations: Conversation[] = [
  {
    id: 'c1',
    brandId: 'b1',
    customerId: 'cust1',
    customerName: 'Marcus Vance',
    customerAvatar: 'MV',
    latestMessage: 'How do I reset my battery again? I tried holding the button but no lights flashed.',
    latestTimestamp: '2026-07-14T13:02:00Z',
    status: 'active_ai',
    messages: [
      {
        id: 'm1_1',
        role: 'customer',
        content: 'Hi! My battery doesn\'t seem to charge. It is plugged into my computer.',
        timestamp: '2026-07-14T12:55:00Z'
      },
      {
        id: 'm1_2',
        role: 'assistant',
        content: 'Hello Marcus! Computer USB ports often do not supply enough voltage (usually only 5W) to charge the AeroDrone X Pro battery, which requires a 30W USB-C charger. Have you tried plugging it into a dedicated 30W wall adapter?',
        timestamp: '2026-07-14T12:56:30Z'
      },
      {
        id: 'm1_3',
        role: 'customer',
        content: 'Ah, ok. How do I reset my battery again? I tried holding the button but no lights flashed.',
        timestamp: '2026-07-14T13:02:00Z'
      }
    ]
  },
  {
    id: 'c2',
    brandId: 'b1',
    customerId: 'cust2',
    customerName: 'Elena Rostova',
    customerAvatar: 'ER',
    latestMessage: 'Your drone crashed itself and almost hit my dog! This is dangerous! I want a full refund or I will call my lawyer and bank to file a chargeback right now!',
    latestTimestamp: '2026-07-14T12:10:00Z',
    status: 'handed_off',
    handoffReason: 'Refund threat / Aggressive legal tone detected in conversation.',
    messages: [
      {
        id: 'm2_1',
        role: 'customer',
        content: 'Hello, my drone had a sudden connection drop during flight today and drifted into a wooden fence. The propellers broke.',
        timestamp: '2026-07-14T11:45:00Z'
      },
      {
        id: 'm2_2',
        role: 'assistant',
        content: 'Oh, I am very sorry to hear that your propellers broke due to a drift! Before we discuss replacing the propellers, could you tell me if you calibrating the compass and GPS home point prior to taking off? This helps avoid connection drift.',
        timestamp: '2026-07-14T11:47:00Z'
      },
      {
        id: 'm2_3',
        role: 'customer',
        content: 'Your drone crashed itself and almost hit my dog! This is dangerous! I want a full refund or I will call my lawyer and bank to file a chargeback right now!',
        timestamp: '2026-07-14T12:10:00Z'
      },
      {
        id: 'm2_4',
        role: 'system',
        content: 'Conversation handed off automatically to Support Team based on rule [r1 - Refund threats]. Notification dispatched.',
        timestamp: '2026-07-14T12:10:05Z'
      }
    ]
  },
  {
    id: 'c3',
    brandId: 'b2',
    customerId: 'cust3',
    customerName: 'Sarah Jenkins',
    customerAvatar: 'SJ',
    latestMessage: 'Thank you! The cool water helped. I will follow with the Hydralock gel now.',
    latestTimestamp: '2026-07-14T10:44:00Z',
    status: 'closed',
    messages: [
      {
        id: 'm3_1',
        role: 'customer',
        content: 'Help! I put on your glow serum and now my cheeks look a bit red and feel warm. Am I allergic?',
        timestamp: '2026-07-14T10:35:00Z'
      },
      {
        id: 'm3_2',
        role: 'assistant',
        content: 'Please don\'t worry, Sarah! I am here to assist you. First, please gently splash your face with cool water to soothe the warm skin. Redness and minor warmth can occur if your skin barrier is highly sensitive or reacting to high concentrations of active serums. Rest assured, our serums are hypoallergenic and safe. Can you tell me if your face is itching or if you feel any swelling?',
        timestamp: '2026-07-14T10:37:00Z'
      },
      {
        id: 'm3_3',
        role: 'customer',
        content: 'Thank you! The cool water helped. I will follow with the Hydralock gel now.',
        timestamp: '2026-07-14T10:44:00Z'
      }
    ]
  },
  {
    id: 'c4',
    brandId: 'b2',
    customerId: 'cust4',
    customerName: 'Miguel Angel',
    customerAvatar: 'MA',
    latestMessage: 'Can you recommend a skincare routine for combination skin?',
    latestTimestamp: '2026-07-14T13:10:00Z',
    status: 'active_ai',
    messages: [
      {
        id: 'm4_1',
        role: 'customer',
        content: 'Can you recommend a skincare routine for combination skin?',
        timestamp: '2026-07-14T13:10:00Z'
      }
    ]
  }
];

export const initialCustomers: Customer[] = [
  {
    id: 'cust1',
    brandId: 'b1',
    displayName: 'Marcus Vance',
    email: 'marcus.vance@gmail.com',
    phone: '+1 (555) 382-9921',
    city: 'Denver, CO',
    language: 'English',
    summary: 'Tech enthusiast who recently purchased AeroDrone X Pro. Experienced slight charger confusion but responded well to technical explanations.',
    updatedAt: '2026-07-14T13:02:00Z',
    facts: [
      { id: 'f1_1', fact: 'Purchased AeroDrone X Pro on July 10, 2026.', confidence: 0.99, source: 'Order DB', createdAt: '2026-07-14T12:55:00Z' },
      { id: 'f1_2', fact: 'Experiencing charging difficulties using high-power drone batteries with a standard 5W PC USB port.', confidence: 0.95, source: 'Message history', createdAt: '2026-07-14T12:56:00Z' }
    ]
  },
  {
    id: 'cust2',
    brandId: 'b1',
    displayName: 'Elena Rostova',
    email: 'elena.rostova@yahoo.com',
    phone: '+1 (415) 839-2041',
    city: 'San Francisco, CA',
    language: 'English',
    summary: 'Disgruntled customer claiming automatic drift crash. Threatened chargeback and legal counsel. Flagged as High Escalation Risk.',
    updatedAt: '2026-07-14T12:10:00Z',
    facts: [
      { id: 'f2_1', fact: 'Drone crashed into wooden fence on July 14, 2026, breaking propellers.', confidence: 0.98, source: 'Message history', createdAt: '2026-07-14T11:45:00Z' },
      { id: 'f2_2', fact: 'Extremely angry about dog safety, demanding full cash refund.', confidence: 0.99, source: 'Message history', createdAt: '2026-07-14T12:10:00Z' }
    ]
  },
  {
    id: 'cust3',
    brandId: 'b2',
    displayName: 'Sarah Jenkins',
    email: 'sarah.j89@outlook.com',
    phone: '+1 (617) 203-1948',
    city: 'Boston, MA',
    language: 'English',
    summary: 'Sensitive skin. Experienced slight warm reaction to Facial Glow Serum but successfully resolved using cold water protocol.',
    updatedAt: '2026-07-14T10:44:00Z',
    facts: [
      { id: 'f3_1', fact: 'Has sensitive skin, prone to redness under strong serums.', confidence: 0.92, source: 'Message history', createdAt: '2026-07-14T10:35:00Z' },
      { id: 'f3_2', fact: 'Owns Luminary Facial Glow Serum & Hydra-Lock Ultra Moisturizer.', confidence: 0.99, source: 'Checkout Sync', createdAt: '2026-07-14T10:35:00Z' }
    ]
  },
  {
    id: 'cust4',
    brandId: 'b2',
    displayName: 'Miguel Angel',
    email: 'm.angel@gmail.com',
    phone: '+34 612 883 942',
    city: 'Madrid, Spain',
    language: 'Spanish',
    summary: 'Prospective buyer looking for skincare recommendations for combination skin.',
    updatedAt: '2026-07-14T13:10:00Z',
    facts: [
      { id: 'f4_1', fact: 'Has combination skin style.', confidence: 0.90, source: 'Message history', createdAt: '2026-07-14T13:10:00Z' }
    ]
  }
];

export const initialUsers: DashboardUser[] = [
  {
    id: 'u1',
    name: 'Sajedur Rahman',
    email: 'sajedurrahmanfiad@gmail.com',
    role: 'admin',
    assignedBrands: ['*'],
    active: true
  },
  {
    id: 'u2',
    name: 'Sofia Martinez',
    email: 'sofia.m@luminaryskincare.com',
    role: 'member',
    assignedBrands: ['b2'],
    active: true
  },
  {
    id: 'u3',
    name: 'Liam Vance',
    email: 'liam@aerogadget.store',
    role: 'member',
    assignedBrands: ['b1'],
    active: true
  }
];

export const initialTransactions: CashTransaction[] = [
  { id: 't1', date: '2026-07-01', brandId: 'b1', brandName: 'AeroGadget Store', type: 'revenue', category: 'subscription', amount: 299.00, description: 'Monthly Premium Platform Fee' },
  { id: 't2', date: '2026-07-02', brandId: 'b1', brandName: 'AeroGadget Store', type: 'revenue', category: 'api_usage', amount: 142.40, description: 'Chatbot Automation Usage Fee (14,240 messages)' },
  { id: 't3', date: '2026-07-03', brandId: 'b2', brandName: 'Luminary Skin Care', type: 'revenue', category: 'subscription', amount: 199.00, description: 'Monthly Growth Platform Fee' },
  { id: 't4', date: '2026-07-04', brandId: 'b2', brandName: 'Luminary Skin Care', type: 'revenue', category: 'api_usage', amount: 84.10, description: 'Chatbot Automation Usage Fee (8,410 messages)' },
  { id: 't5', date: '2026-07-05', brandId: 'b1', brandName: 'AeroGadget Store', type: 'cost', category: 'server', amount: -45.00, description: 'Dedicated vector DB hosting portion' },
  { id: 't6', date: '2026-07-05', brandId: 'b2', brandName: 'Luminary Skin Care', type: 'cost', category: 'api_usage', amount: -21.02, description: 'Gemini LLM Provider Cost (0.7M Input / 1.1M Output Tokens)' },
  { id: 't7', date: '2026-07-05', brandId: 'b1', brandName: 'AeroGadget Store', type: 'cost', category: 'api_usage', amount: -35.60, description: 'Gemini LLM Provider Cost (1.2M Input / 1.8M Output Tokens)' },
  { id: 't8', date: '2026-07-10', brandId: 'b3', brandName: 'Solas Footwear', type: 'revenue', category: 'subscription', amount: 99.00, description: 'Starter Tier subscription' },
  { id: 't9', date: '2026-07-12', brandId: 'system', brandName: 'Platform Central', type: 'cost', category: 'server', amount: -120.00, description: 'Global Cloud Run / Nginx Cluster Core Nodes' }
];

export const initialHealth: SystemHealthStatus = {
  llmProviderStatus: 'healthy',
  facebookApiStatus: 'healthy',
  speechProviderStatus: 'healthy',
  databaseStatus: 'healthy',
  queueStatus: 'active',
  overallHealth: 'healthy',
  lastChecked: '2026-07-14T13:10:00Z'
};

export const initialLogs: ServerLogEntry[] = [
  { id: 'log1', timestamp: '2026-07-14T13:00:02Z', level: 'INFO', source: 'python-bot', message: 'Loaded brand AeroGadget system prompt (340 words) and rules (2 items).' },
  { id: 'log2', timestamp: '2026-07-14T13:00:05Z', level: 'INFO', source: 'webhook-fb', message: 'Received POST webhook request from Meta server. Validation code 200.' },
  { id: 'log3', timestamp: '2026-07-14T13:02:00Z', level: 'INFO', source: 'python-bot', message: 'User Marcus Vance sent: "How do I reset my battery..." - Executed RAG retrieval. Top matched document: kd3 (Score: 0.91).' },
  { id: 'log4', timestamp: '2026-07-14T13:02:02Z', level: 'INFO', source: 'python-bot', message: 'Gemini API replied successfully in 1.45s. Tokens used: 140 prompt, 95 output.' },
  { id: 'log5', timestamp: '2026-07-14T13:05:40Z', level: 'WARNING', source: 'rag-indexer', message: 'Embedding job for document kd6 is currently pending because the vector cache is busy.' },
  { id: 'log6', timestamp: '2026-07-14T13:10:00Z', level: 'INFO', source: 'scheduler', message: 'Executing cron job: sync_facebook_webhooks. Processed 2 webhooks successfully.' },
  { id: 'log7', timestamp: '2026-07-14T13:12:15Z', level: 'ERROR', source: 'webhook-fb', message: 'Failed to dispatch webhook response to page Solas Footwear. Error: OAuth token expired or revoked.' },
  { id: 'log8', timestamp: '2026-07-14T13:14:01Z', level: 'INFO', source: 'python-bot', message: 'Customer Miguel Angel requested routine for combination skin. Language: es. RAG retrieval skipped, context-guided.' }
];

export const initialSecrets: SecretKey[] = [
  { id: 'sec1', name: 'PLATFORM_JWT_SECRET', keyMasked: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', scope: 'global', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'sec2', name: 'GEMINI_API_KEY', keyMasked: 'AIzaSyC0L1mI...u82Gf9K38', scope: 'global', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 'sec3', name: 'AEROGADGET_META_SECRET', keyMasked: 'fb_app_sec_994b2...83d73a', scope: 'brand', brandId: 'b1', updatedAt: '2026-07-10T12:00:00Z' },
  { id: 'sec4', name: 'LUMINARY_META_SECRET', keyMasked: 'fb_app_sec_394d2...01e2cf', scope: 'brand', brandId: 'b2', updatedAt: '2026-07-11T14:00:00Z' }
];

export const initialAuditLogs: AuditLogEntry[] = [
  { id: 'au1', timestamp: '2026-07-14T09:00:00Z', user: 'Sajedur Rahman', action: 'CREATE_BRAND', category: 'Brand', resource: 'Solas Footwear', details: 'Added new brand Solas Footwear to the platform with default starter settings.' },
  { id: 'au2', timestamp: '2026-07-14T10:30:15Z', user: 'Sajedur Rahman', action: 'UPDATE_PROMPT', category: 'Prompt Studio', resource: 'AeroGadget Store', details: 'Modified the primary system prompt to include battery safety disclaimers.' },
  { id: 'au3', timestamp: '2026-07-14T11:45:00Z', user: 'Sofia Martinez', action: 'CREATE_KNOWLEDGE', category: 'Knowledge Base', resource: 'Allergy patch guide', details: 'Uploaded a skin sensitivity guidance document for Luminary Skin Care.' },
  { id: 'au4', timestamp: '2026-07-14T12:10:05Z', user: 'System Bot', action: 'AUTO_HANDOFF', category: 'Conversation', resource: 'Elena Rostova', details: 'Conversation Elena Rostova (b1) automatically handed off due to refund threat triggering rule r1.' },
  { id: 'au5', timestamp: '2026-07-14T13:00:00Z', user: 'Liam Vance', action: 'TOGGLE_FACEBOOK_AUTO', category: 'Integrations', resource: 'AeroGadget Page', details: 'Deactivated Facebook comment automation, keeping direct messages active.' }
];

export const initialJobs: BackgroundJob[] = [
  { id: 'job_1', kind: 'RAG_REINDEX', status: 'completed', attempts: 1, payload: '{"brandId":"b1","docId":"kd3"}', updatedAt: '2026-07-14T11:00:00Z' },
  { id: 'job_2', kind: 'FACEBOOK_WEBHOOK_RETRY', status: 'failed', attempts: 3, payload: '{"brandId":"b3","messageId":"msg_fb_99321"}', error: 'OAuthException: The access token has expired.', updatedAt: '2026-07-14T13:12:15Z' },
  { id: 'job_3', kind: 'CUSTOMER_FACT_EXTRACTION', status: 'processing', attempts: 1, payload: '{"customerId":"cust1","conversationId":"c1"}', updatedAt: '2026-07-14T13:02:10Z' },
  { id: 'job_4', kind: 'MONTHLY_BILLING_RUN', status: 'pending', attempts: 0, payload: '{"period":"2026-07"}', updatedAt: '2026-07-14T13:15:00Z' }
];

export const initialSettings: DashboardSettings = {
  appName: 'AI Support Control Panel',
  adminEmail: 'sajedurrahmanfiad@gmail.com',
  defaultBrandId: 'b1',
  refreshIntervalSeconds: 10,
  enableNotifications: true
};
