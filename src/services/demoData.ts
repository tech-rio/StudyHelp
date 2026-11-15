import type { StudyPackage } from '../types/study';

export const DEEP_LEARNING_DECK: StudyPackage = {
  title: "Deep Learning: Neural Networks & Backpropagation",
  overview: "Deep learning is a subset of machine learning based on artificial neural networks with multiple layers. The core training mechanism is backpropagation combined with gradient descent, which adjusts synaptic weights to minimize a defined loss function over training data.",
  overviewEli5: "Imagine learning to shoot basketball hoops blindfolded. A friend tells you 'You threw it 2 feet too far to the left' (the error). Next time, you adjust your arm slightly (weight update) until you sink the ball every single time! That's how neural networks learn.",
  tags: ["Machine Learning", "Deep Learning", "Calculus", "Optimization"],
  generatedAt: new Date().toISOString(),
  keyPoints: [
    {
      id: "kp-1",
      topic: "Artificial Neurons (Perceptrons)",
      summary: "The fundamental computational unit. Calculates the weighted sum of inputs plus a bias term, then passes the result through a non-linear activation function to introduce representation capacity.",
      eli5: "A tiny decision-maker that weighs up different clues (like weather, mood, money) before deciding whether to go out or stay home.",
      formulasOrSyntax: ["z = \\sum (w_i \\cdot x_i) + b", "a = \\sigma(z)"],
      importance: "critical"
    },
    {
      id: "kp-2",
      topic: "Non-Linear Activation Functions",
      summary: "Without non-linear activations, stacking any number of layers collapses into a single linear transformation (y = Wx + b). Common activations include ReLU, GELU, Sigmoid, and LeakyReLU.",
      eli5: "Without switches that turn on and off, a giant network with 100 layers would be no smarter than a simple 1-layer ruler.",
      formulasOrSyntax: ["ReLU(z) = \\max(0, z)", "\\sigma(z) = \\frac{1}{1 + e^{-z}}"],
      importance: "high"
    },
    {
      id: "kp-3",
      topic: "Backpropagation & The Chain Rule",
      summary: "Backpropagation is the efficient computation of the gradient of the loss function with respect to every weight in the network via recursive application of the multivariate chain rule from calculus.",
      eli5: "Tracing a mistake backward step-by-step through the assembly line to figure out which worker's hand slipped the most.",
      formulasOrSyntax: ["\\frac{\\partial \\mathcal{L}}{\\partial w_l} = \\frac{\\partial \\mathcal{L}}{\\partial a_l} \\cdot \\frac{\\partial a_l}{\\partial z_l} \\cdot \\frac{\\partial z_l}{\\partial w_l}"],
      importance: "critical"
    },
    {
      id: "kp-4",
      topic: "Gradient Descent Optimizers",
      summary: "First-order iterative optimization algorithms. SGD updates weights along the negative gradient. Modern variants (Adam, RMSProp) incorporate momentum and adaptive per-parameter learning rates.",
      eli5: "A hiker trying to walk down a foggy mountain to the lowest valley by feeling which direction slopes down most steeply with their feet.",
      formulasOrSyntax: ["w_{t+1} = w_t - \\eta \\nabla \\mathcal{L}(w_t)", "m_t = \\beta_1 m_{t-1} + (1-\\beta_1)g_t"],
      importance: "high"
    },
    {
      id: "kp-5",
      topic: "Vanishing & Exploding Gradients",
      summary: "In deep networks, gradients can exponentially shrink to zero (vanishing) or explode to infinity during backpropagation due to repeated matrix multiplications, preventing earlier layers from training.",
      eli5: "Playing a game of telephone with 50 people. By the 40th person, the message is either completely inaudible or totally distorted shouting.",
      formulasOrSyntax: ["Solutions: Residual connections (ResNet), Batch Normalization, He/Xavier weight initialization"],
      importance: "critical"
    }
  ],
  flashcards: [
    {
      id: "fc-1",
      front: "Why are non-linear activation functions required in deep neural networks?",
      back: "Because a composition of purely linear functions is still just a linear function. Non-linearities allow the network to approximate arbitrary complex non-linear functions (Universal Approximation Theorem).",
      category: "Architectures",
      mastery: "learning"
    },
    {
      id: "fc-2",
      front: "What mathematical principle powers the Backpropagation algorithm?",
      back: "The Chain Rule of calculus. It allows computing the gradient of the loss function with respect to weights in early layers by multiplying intermediate partial derivatives backward from output to input.",
      category: "Optimization",
      mastery: "reviewing"
    },
    {
      id: "fc-3",
      front: "What is the Dying ReLU problem, and how is it mitigated?",
      back: "When inputs to a ReLU unit are consistently negative (z <= 0), its gradient is 0, permanently deactivating the neuron. Mitigation includes using Leaky ReLU, ELU, or careful weight initialization (He normal).",
      category: "Activations",
      mastery: "learning"
    },
    {
      id: "fc-4",
      front: "How does Adam Optimizer combine AdaGrad and RMSProp with Momentum?",
      back: "Adam computes exponential moving averages of both past gradients (first moment / momentum) and past squared gradients (second moment / RMSProp), applying bias corrections for rapid convergence.",
      category: "Optimizers",
      mastery: "mastered"
    },
    {
      id: "fc-5",
      front: "What is the primary purpose of Dropout during training?",
      back: "Dropout randomly sets a fraction (e.g. 50%) of neuron activations to zero during forward pass, breaking co-adaptation between neurons and acting as an ensemble regularization technique against overfitting.",
      category: "Regularization",
      mastery: "reviewing"
    },
    {
      id: "fc-6",
      front: "What is the difference between Batch, Mini-Batch, and Stochastic Gradient Descent (SGD)?",
      back: "Batch GD computes gradients over the entire dataset (slow, high memory); pure SGD computes gradient per single sample (noisy); Mini-Batch GD computes over small subsets (e.g., 32-256 samples) balancing speed, vectorization, and stability.",
      category: "Optimization",
      mastery: "mastered"
    }
  ],
  quiz: [
    {
      id: "q-1",
      question: "If all activation functions in a 50-layer deep neural network are set to f(x) = 2x, what is the effective model equivalent to?",
      options: [
        "A 50th degree polynomial model",
        "A single-layer linear model with scaled weights",
        "A highly non-linear classifier",
        "An undefined, divergent transformation"
      ],
      correctIndex: 1,
      explanation: "Matrix multiplication of multiple linear transformations W1(W2(W3...x)) collapses into a single matrix product W_effective * x. Without non-linearities, depth provides zero extra expressive capacity.",
      tip: "Remember that the composition of linear operations is strictly linear."
    },
    {
      id: "q-2",
      question: "Which component of the neuron computational graph is computed during the FORWARD pass?",
      options: [
        "Weight gradients (dL/dw)",
        "Activation values and loss L",
        "Error delta signals",
        "Learning rate decay schedule"
      ],
      correctIndex: 1,
      explanation: "During the forward pass, input data propagates forward through the layers to compute intermediate pre-activations (z), activations (a), and finally the scalar Loss (L). Gradients are computed on the backward pass.",
      tip: "Forward pass evaluates the function; backward pass evaluates the derivatives."
    },
    {
      id: "q-3",
      question: "Why does the Sigmoid activation function often cause vanishing gradients in deep networks?",
      options: [
        "Its derivative is unbounded and exceeds 100",
        "Its maximum derivative value is only 0.25",
        "It outputs negative numbers exclusively",
        "It cannot be differentiated analytically"
      ],
      correctIndex: 1,
      explanation: "The derivative of sigmoid σ'(z) = σ(z)(1-σ(z)) has a maximum value of 0.25 (at z=0). When chain multiplying numbers <= 0.25 across many layers, the gradient approaches zero exponentially.",
      tip: "Think about what happens when you multiply 0.25 by itself 10 times."
    },
    {
      id: "q-4",
      question: "What role does the 'momentum' hyperparameter play in Gradient Descent?",
      options: [
        "It exponentially increases the batch size over time",
        "It accumulates a fraction of past update vectors to accelerate through flat plateaus and dampen oscillations",
        "It clips gradients that exceed a given Euclidean norm",
        "It resets model weights when validation loss stalls"
      ],
      correctIndex: 1,
      explanation: "Momentum acts like a heavy ball rolling down a hill: it retains velocity along consistent downhill slopes and smooths out noisy, perpendicular oscillations.",
      tip: "Think of physical inertia smoothing out jerky movements."
    },
    {
      id: "q-5",
      question: "How do Residual Connections (Skip Connections in ResNet) overcome the vanishing gradient problem?",
      options: [
        "By replacing all multiplications with additions in forward pass",
        "By providing an identity shortcut (F(x) + x) where gradients can flow backward uninterrupted as (+ 1)",
        "By eliminating the need for backpropagation entirely",
        "By dynamically increasing the learning rate at each layer"
      ],
      correctIndex: 1,
      explanation: "In ResNet, y = F(x) + x. When taking the derivative d/dx, the term becomes dF/dx + 1. The '+1' term guarantees that gradients can flow directly to early layers without shrinking to zero.",
      tip: "The gradient of (F(x) + x) with respect to x includes an additive constant of 1."
    }
  ],
  mindMap: {
    id: "root",
    label: "Deep Learning Foundations",
    color: "#1c1917",
    description: "Core architecture, mathematical foundations, and training mechanics.",
    children: [
      {
        id: "arch",
        label: "Network Architecture",
        color: "#44403c",
        description: "Structural layout of artificial neural networks.",
        children: [
          { id: "node-neuron", label: "Artificial Neuron (Weights, Bias, Sum)" },
          { id: "node-act", label: "Activation Functions (ReLU, GELU, Sigmoid)" },
          { id: "node-layers", label: "Layers (Dense, Conv, Recurrent, Attention)" }
        ]
      },
      {
        id: "optimization",
        label: "Training & Optimization",
        color: "#047857",
        description: "How models compute loss and update parameters.",
        children: [
          { id: "node-loss", label: "Loss Functions (Cross-Entropy, MSE, Huber)" },
          { id: "node-backprop", label: "Backpropagation (Calculus Chain Rule)" },
          { id: "node-optimizers", label: "Optimizers (SGD, Momentum, Adam, AdamW)" }
        ]
      },
      {
        id: "challenges",
        label: "Training Challenges & Solutions",
        color: "#b45309",
        description: "Overcoming gradient instability and overfitting.",
        children: [
          { id: "node-vanishing", label: "Vanishing / Exploding Gradients" },
          { id: "node-regularization", label: "Regularization (Dropout, L1/L2, Early Stop)" },
          { id: "node-normalization", label: "Normalization (BatchNorm, LayerNorm, ResNet Skips)" }
        ]
      }
    ]
  }
};

export const OPERATING_SYSTEMS_DECK: StudyPackage = {
  title: "Operating Systems: Concurrency, Deadlocks & Synchronization",
  overview: "In modern operating systems, concurrent threads and processes compete for shared hardware and memory resources. Without proper mutual exclusion and synchronization primitives (mutexes, semaphores, monitors), race conditions and deadlocks inevitably occur.",
  overviewEli5: "Imagine 4 chefs sharing one stove and one cutting board. If Chef A takes the board and waits for the stove, while Chef B takes the stove and waits for the board, neither can cook and dinner is ruined forever! That's a deadlock.",
  tags: ["Computer Science", "Operating Systems", "Systems Programming"],
  generatedAt: new Date().toISOString(),
  keyPoints: [
    {
      id: "os-kp-1",
      topic: "Race Conditions & Critical Section",
      summary: "A race condition occurs when multiple threads manipulate shared data concurrently and the outcome depends on execution timing. The critical section is the code segment where shared resources are accessed.",
      eli5: "Two people using the same ATM card at the exact same second to withdraw money before the bank balance updates.",
      formulasOrSyntax: ["Requirements: Mutual Exclusion, Progress, Bounded Waiting"],
      importance: "critical"
    },
    {
      id: "os-kp-2",
      topic: "Synchronization Primitives",
      summary: "Hardware atomic instructions (TestAndSet, CompareAndSwap) form the basis for higher-level software abstractions: Spinlocks, Mutexes, Counting/Binary Semaphores, and Condition Variables.",
      eli5: "A bathroom key on a gas station pegboard. If the key is gone, you have to wait in line until the current user hangs it back up.",
      formulasOrSyntax: ["wait(S) { while (S<=0); S--; }", "signal(S) { S++; }"],
      importance: "high"
    },
    {
      id: "os-kp-3",
      topic: "The 4 Coffman Deadlock Conditions",
      summary: "A deadlock can occur if and only if all four conditions hold simultaneously: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.",
      eli5: "To prevent a four-car traffic jam at an intersection, breaking just ONE of the 4 conditions is enough to keep cars moving.",
      formulasOrSyntax: ["1. Mutual Exclusion", "2. Hold & Wait", "3. No Preemption", "4. Circular Wait"],
      importance: "critical"
    },
    {
      id: "os-kp-4",
      topic: "Banker's Algorithm for Deadlock Avoidance",
      summary: "Dijkstra's Banker's Algorithm dynamically tests for safety by simulating the allocation of predetermined maximum possible amounts of all resources, ensuring a safe execution sequence always exists.",
      eli5: "A prudent bank manager who never loans out all their cash unless they know every single customer will eventually repay their loan in order.",
      formulasOrSyntax: ["Need[i][j] = Max[i][j] - Allocation[i][j]", "Safe State: \\exists \\langle P_1, P_2, ..., P_n \\rangle"],
      importance: "high"
    }
  ],
  flashcards: [
    {
      id: "os-fc-1",
      front: "What are the four necessary Coffman conditions for a deadlock to occur?",
      back: "1. Mutual Exclusion (non-shareable resources)\n2. Hold and Wait (holding one resource while requesting another)\n3. No Preemption (resources cannot be forcibly confiscated)\n4. Circular Wait (a closed loop of processes waiting for each other)",
      category: "Deadlocks",
      mastery: "mastered"
    },
    {
      id: "os-fc-2",
      front: "What is the difference between a Binary Semaphore and a Mutex?",
      back: "A Mutex has an ownership semantic (only the thread that locked it may unlock it). A Binary Semaphore has no concept of ownership—any thread can signal (unlock) it, making it suitable for signaling and synchronization between different threads.",
      category: "Synchronization",
      mastery: "reviewing"
    },
    {
      id: "os-fc-3",
      front: "What is a 'Spinlock', and when is it preferable to a sleeping mutex?",
      back: "A spinlock busy-waits in a CPU loop until the lock becomes free. It is preferred in multi-core systems when the lock is held for very short intervals (less than the context-switch overhead time).",
      category: "Locks",
      mastery: "learning"
    }
  ],
  quiz: [
    {
      id: "os-q-1",
      question: "Which Coffman deadlock condition is broken by enforcing a strict global ordering on resource acquisition?",
      options: [
        "Mutual Exclusion",
        "Hold and Wait",
        "Circular Wait",
        "No Preemption"
      ],
      correctIndex: 2,
      explanation: "By requiring all processes to request resources in strictly ascending numerical order (e.g. Lock A before Lock B), a circular dependency cycle becomes mathematically impossible.",
      tip: "Think about cycles in directed graphs."
    },
    {
      id: "os-q-2",
      question: "What is 'Priority Inversion' and how does Priority Inheritance solve it?",
      options: [
        "A low priority thread starves high priority threads; solved by boosting the low priority thread's priority while it holds the shared resource",
        "The CPU reorders instructions; solved by adding memory barriers",
        "High priority threads run in an infinite loop; solved by preemption",
        "Virtual memory pages are swapped inversely; solved by LRU eviction"
      ],
      correctIndex: 0,
      explanation: "When a low-priority thread holds a lock needed by a high-priority thread, medium-priority threads might preempt the low-priority thread, starving the high-priority thread. Priority Inheritance temporarily promotes the low-priority thread to the high priority level.",
      tip: "Famous issue that almost crippled the Mars Pathfinder spacecraft in 1997."
    }
  ],
  mindMap: {
    id: "os-root",
    label: "OS Concurrency & Resource Management",
    color: "#1c1917",
    description: "Threads, race conditions, synchronization and deadlock handling.",
    children: [
      {
        id: "os-sync",
        label: "Thread Synchronization",
        color: "#059669",
        children: [
          { id: "os-crit", label: "Critical Section Problem" },
          { id: "os-prims", label: "Primitives (Mutex, Semaphores, Monitors)" },
          { id: "os-atomic", label: "Hardware Atomics (CAS, TestAndSet)" }
        ]
      },
      {
        id: "os-deadlock",
        label: "Deadlock Management",
        color: "#dc2626",
        children: [
          { id: "os-coffman", label: "4 Coffman Conditions" },
          { id: "os-bankers", label: "Avoidance (Banker's Algorithm)" },
          { id: "os-recovery", label: "Detection & Recovery (Resource Graphs)" }
        ]
      }
    ]
  }
};
