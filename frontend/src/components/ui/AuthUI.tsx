import * as React from "react";
import { useState, useId, useEffect } from "react";
import { Slot } from "@radix-ui/react-slot";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TypewriterProps {
  text: string | string[];
  speed?: number;
  cursor?: string;
  loop?: boolean;
  deleteSpeed?: number;
  delay?: number;
  className?: string;
}

export function Typewriter({
  text,
  speed = 100,
  cursor = "|",
  loop = false,
  deleteSpeed = 50,
  delay = 1500,
  className,
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [textArrayIndex, setTextArrayIndex] = useState(0);

  const textArray = Array.isArray(text) ? text : [text];
  const currentText = textArray[textArrayIndex] || "";

  useEffect(() => {
    if (!currentText) return;

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentIndex < currentText.length) {
            setDisplayText((prev) => prev + currentText[currentIndex]);
            setCurrentIndex((prev) => prev + 1);
          } else if (loop) {
            setTimeout(() => setIsDeleting(true), delay);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText((prev) => prev.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentIndex(0);
            setTextArrayIndex((prev) => (prev + 1) % textArray.length);
          }
        }
      },
      isDeleting ? deleteSpeed : speed,
    );

    return () => clearTimeout(timeout);
  }, [
    currentIndex,
    isDeleting,
    currentText,
    loop,
    speed,
    deleteSpeed,
    delay,
    displayText,
    text,
  ]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">{cursor}</span>
    </span>
  );
}

const labelVariants = cva(
  "text-sm font-medium leading-none text-slate-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 ring-offset-slate-950",
  {
    variants: {
      variant: {
        default:
          "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline:
          "border border-slate-700 bg-transparent hover:bg-slate-800 text-white",
        secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700",
        ghost: "hover:bg-slate-800 text-white",
        link: "text-indigo-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-3 text-sm text-white shadow-sm transition-colors placeholder:text-slate-500 focus-visible:border-indigo-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}
const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, ...props }, ref) => {
    const id = useId();
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    return (
      <div className="grid w-full items-center gap-2">
        {label && <Label htmlFor={id}>{label}</Label>}
        <div className="relative">
          <Input
            id={id}
            type={showPassword ? "text" : "password"}
            className={cn("pe-10", className)}
            ref={ref}
            {...props}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 end-0 flex h-full w-10 items-center justify-center text-slate-400 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      console.log("Resposta completa del servidor:", response);

      const userData = response.user;
      const token = response.access_token;

      if (!token || !userData) {
        throw new Error("S'ha iniciat la sessió però falten dades del servidor.");
      }

      login(userData, token);

      // Redirecció
      navigate(userData.role === "admin" ? "/admin" : "/dashboard");

    } catch (err: any) {
      setError(err.message || "Error a l'iniciar sessió");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSignIn}
      autoComplete="on"
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col items-center gap-2 text-center mb-2">
        <h1 className="text-2xl font-bold text-white">Iniciar Sessió</h1>
        <p className="text-balance text-sm text-slate-400">
          Introdueix les teves dades per continuar
        </p>
      </div>
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg text-center">
          {error}
        </div>
      )}
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Correu Electrònic</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correu@exemple.com"
            required
            autoComplete="email"
          />
        </div>
        <PasswordInput
          name="password"
          label="Contrasenya"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          placeholder="Contrasenya"
        />
        <Button
          type="submit"
          variant="default"
          className="mt-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Entrant...
            </>
          ) : (
            "Iniciar Sessió"
          )}
        </Button>
      </div>
    </form>
  );
}

function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      setError("Les contrasenyes no coincideixen");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await apiFetch("/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      console.log("Resposta registre:", response);

      // Extracció flexible: comprovem l'arrel i també l'objecte "data" si existís
      const userData = response.user || response.data?.user;
      const token = response.access_token || response.data?.access_token;

      if (!token || !userData) {
        console.error("Dades mancants en la resposta:", response);
        throw new Error("S'ha creat la compte però falten dades del servidor.");
      }

      login(userData, token);

      // Redirecció intel·ligent segons el rol
      const destination = userData.role === "admin" ? "/admin" : "/dashboard";
      navigate(destination);

    } catch (err: any) {
      if (err.errors) {
        const messages = Object.values(err.errors).flat();
        setError(messages.join(", "));
      } else {
        setError(err.message || "Error al crear la compte");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSignUp}
      autoComplete="on"
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col items-center gap-2 text-center mb-2">
        <h1 className="text-2xl font-bold text-white">Crear Compte</h1>
        <p className="text-balance text-sm text-slate-400">
          Introdueix les teves dades per registrar-te
        </p>
      </div>
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg text-center">
          {error}
        </div>
      )}
      <div className="grid gap-3">
        <div className="grid gap-2">
          <Label htmlFor="name">Nom Complet</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="El teu nom"
            required
            autoComplete="name"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Correu Electrònic</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correu@exemple.com"
            required
            autoComplete="email"
          />
        </div>
        <PasswordInput
          name="password"
          label="Contrasenya"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          placeholder="Contrasenya"
        />
        <PasswordInput
          name="password_confirmation"
          label="Confirmar Contrasenya"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
          autoComplete="new-password"
          placeholder="Confirmar Contrasenya"
        />
        <Button
          type="submit"
          variant="default"
          className="mt-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creant...
            </>
          ) : (
            "Registrar-se"
          )}
        </Button>
      </div>
    </form>
  );
}

function AuthFormContainer({
  isSignIn,
  onToggle,
}: {
  isSignIn: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="mx-auto grid w-[350px] gap-6">
      {isSignIn ? <SignInForm /> : <SignUpForm />}
      <div className="text-center text-sm">
        {isSignIn ? "No tens cap compte?" : "Ja tens un compte?"}{" "}
        <Button variant="link" className="pl-1 text-white" onClick={onToggle}>
          {isSignIn ? "Registra't" : "Inicia sessió"}
        </Button>
      </div>
      {/* Opcional: Registre amb Google */}
    </div>
  );
}

interface AuthContentProps {
  image?: {
    src: string;
    alt: string;
  };
  quote?: {
    text: string;
    author: string;
  };
}

interface AuthUIProps {
  signInContent?: AuthContentProps;
  signUpContent?: AuthContentProps;
}

const defaultSignInContent = {
  image: {
    src: "https://images.unsplash.com/photo-1488036106564-87ecb155bb15?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "A live concert",
  },
  quote: {
    text: "Benvingut de nou! El concert t'espera.",
    author: "Concert Hub",
  },
};

const defaultSignUpContent = {
  image: {
    src: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2940&auto=format&fit=crop",
    alt: "A vibrant live event",
  },
  quote: {
    text: "Crea un compte. Un nou capítol comença.",
    author: "Concert Hub",
  },
};

export const AuthUI = ({
  signInContent = {},
  signUpContent = {},
}: AuthUIProps) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const toggleForm = () => setIsSignIn((prev) => !prev);

  const finalSignInContent = {
    image: { ...defaultSignInContent.image, ...signInContent.image },
    quote: { ...defaultSignInContent.quote, ...signInContent.quote },
  };
  const finalSignUpContent = {
    image: { ...defaultSignUpContent.image, ...signUpContent.image },
    quote: { ...defaultSignUpContent.quote, ...signUpContent.quote },
  };

  const currentContent = isSignIn ? finalSignInContent : finalSignUpContent;

  return (
    <div className="w-full min-h-screen md:grid md:grid-cols-2 bg-slate-950">
      <div className="flex h-screen items-center justify-center p-6 md:h-auto md:p-0 md:py-12 bg-slate-950">
        <AuthFormContainer isSignIn={isSignIn} onToggle={toggleForm} />
      </div>

      <div 
        className="hidden md:block relative bg-cover bg-center"
        style={{ backgroundImage: `url('${currentContent.image.src}')` }}
      >
        <div className="absolute inset-0 bg-slate-950/40" />
        <div className="absolute inset-x-0 bottom-0 h-[150px] bg-gradient-to-t from-slate-950 to-transparent" />

        <div className="relative z-10 flex h-full flex-col items-center justify-end p-8 pb-12">
          <blockquote className="space-y-4 text-center text-white">
            <p className="text-2xl font-medium tracking-tight">
              “
              <Typewriter
                key={currentContent.quote.text}
                text={currentContent.quote.text}
                speed={60}
              />
              ”
            </p>
            <cite className="block text-sm font-light text-slate-300 not-italic uppercase tracking-widest">
              — {currentContent.quote.author}
            </cite>
          </blockquote>
        </div>
      </div>
    </div>
  );
};
