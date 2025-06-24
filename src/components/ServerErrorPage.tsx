import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, RefreshCw, AlertTriangle, WifiOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

interface ServerErrorPageProps {
  errorCode?: number;
  title?: string;
  description?: string;
  showRefresh?: boolean;
  onGoHome?: () => void;
}

const ServerErrorPage: React.FC<ServerErrorPageProps> = ({
    errorCode = 500,
    title,
    description,
    showRefresh = true,
    onGoHome, // <-- you missed this!
  }) => {   
  const navigate = useNavigate();

  const getErrorContent = () => {
    switch (errorCode) {
      case 404:
        return {
          title: title || "Page Not Found",
          description: description || "The page you're looking for doesn't exist. It may have been moved or deleted.",
          color: "text-blue-600 dark:text-blue-400",
          bgGradient: "from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20",
          character: "confused"
        };
      case 500:
        return {
          title: title || "Internal Server Error",
          description: description || "Something went wrong on our servers. Our team has been notified and is working to fix this.",
          color: "text-red-600 dark:text-red-400",
          bgGradient: "from-red-50 to-rose-100 dark:from-red-950/20 dark:to-pink-950/20",
          character: "broken"
        };
      case 503:
        return {
          title: title || "Service Unavailable",
          description: description || "Our servers are temporarily down for maintenance. Please try again in a few minutes.",
          color: "text-yellow-600 dark:text-yellow-400",
          bgGradient: "from-yellow-50 to-orange-100 dark:from-yellow-950/20 dark:to-orange-950/20",
          character: "maintenance"
        };
      case 502:
        return {
          title: title || "Bad Gateway",
          description: description || "There's a problem with our server connection. Please try again later.",
          color: "text-purple-600 dark:text-purple-400",
          bgGradient: "from-purple-50 to-violet-100 dark:from-purple-950/20 dark:to-violet-950/20",
          character: "disconnected"
        };
      case 504:
        return {
          title: title || "Gateway Timeout",
          description: description || "The server took too long to respond. Please try again.",
          color: "text-orange-600 dark:text-orange-400",
          bgGradient: "from-orange-50 to-red-100 dark:from-orange-950/20 dark:to-red-950/20",
          character: "slow"
        };
      default:
        return {
          title: title || "Something Went Wrong",
          description: description || "An unexpected error occurred. Please try again later.",
          color: "text-gray-600 dark:text-gray-400",
          bgGradient: "from-gray-50 to-slate-100 dark:from-gray-950/20 dark:to-slate-950/20",
          character: "sad"
        };
    }
  };

  const errorContent = getErrorContent();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome(); // Use parent callback if provided
    } else {
      navigate('/dashboard'); // Fallback
    }
  };
  

  const renderCharacter = () => {
    const { character } = errorContent;
    
    return (
        <div className="relative w-32 h-32 mx-auto mb-6 text-black dark:text-[hsl(var(--border))]">
        <svg
          viewBox="0 0 128 128"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          color="inherit"
        >
          {/* Character Body */}
          <g className="animate-[bounce_3s_ease-in-out_infinite]">
            {/* Head */}
            <circle
              cx="64"
              cy="48"
              r="28"
              fill="hsl(var(--muted))"
              stroke="currentColor" 
              strokeWidth="2"
              className="animate-[pulse_2s_ease-in-out_infinite]"
            />
            
            {/* Face based on error type */}
            {character === "confused" && (
              <>
                {/* Confused eyes */}
                <circle cx="56" cy="44" r="2.5" fill="hsl(var(--foreground))" />
                <circle cx="72" cy="44" r="2.5" fill="hsl(var(--foreground))" />
                <path d="M 56 40 Q 60 36 64 40" stroke="hsl(var(--foreground))" strokeWidth="1.5" fill="none" />
                <path d="M 64 40 Q 68 36 72 40" stroke="hsl(var(--foreground))" strokeWidth="1.5" fill="none" />
                {/* Question mark mouth */}
                <path d="M 58 56 Q 64 52 70 56 Q 64 60 64 62" stroke="hsl(var(--foreground))" strokeWidth="1.5" fill="none" />
                <circle cx="64" cy="65" r="1" fill="hsl(var(--foreground))" />
              </>
            )}
            
            {character === "broken" && (
              <>
                {/* X eyes */}
                <path d="M 54 42 L 58 46 M 58 42 L 54 46" stroke="hsl(var(--destructive))" strokeWidth="1.5" />
                <path d="M 70 42 L 74 46 M 74 42 L 70 46" stroke="hsl(var(--destructive))" strokeWidth="1.5" />
                {/* Sad mouth */}
                <path d="M 56 60 Q 64 52 72 60" stroke="hsl(var(--destructive))" strokeWidth="1.5" fill="none" />
                {/* Cracks on head */}
                <path d="M 48 28 L 52 20 L 56 24" stroke="hsl(var(--destructive))" strokeWidth="1" fill="none" />
              </>
            )}
            
            {character === "maintenance" && (
              <>
                {/* Sleepy eyes */}
                <path d="M 54 44 Q 56 42 58 44" stroke="hsl(var(--foreground))" strokeWidth="1.5" fill="none" />
                <path d="M 70 44 Q 72 42 74 44" stroke="hsl(var(--foreground))" strokeWidth="1.5" fill="none" />
                {/* Neutral mouth */}
                <line x1="60" y1="56" x2="68" y2="56" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
                {/* Construction hat */}
                <rect x="48" y="20" width="32" height="8" rx="4" fill="hsl(var(--primary))" />
              </>
            )}
            
            {(character === "disconnected" || character === "slow" || character === "sad") && (
  <>
    {/* Sad eyes */}
    <circle cx="56" cy="44" r="2.5" fill="#111" />
    <circle cx="72" cy="44" r="2.5" fill="#111" />
    {/* Tears */}
    <ellipse
      cx="53"
      cy="50"
      rx="1.5"
      ry="4"
      fill="hsl(var(--primary))"
      className="animate-[fade-in_2s_ease-in-out_infinite]"
    />
    <ellipse
      cx="75"
      cy="50"
      rx="1.5"
      ry="4"
      fill="hsl(var(--primary))"
      className="animate-[fade-in_2s_ease-in-out_infinite]"
    />
    {/* Sad mouth */}
    <path
      d="M 56 60 Q 64 52 72 60"
      stroke="#111"
      strokeWidth="1.5"
      fill="none"
    />
  </>
)}

            
            {/* Body */}
            <rect x="52" y="76" width="24" height="32" rx="12" fill="hsl(var(--muted))" stroke="currentColor"  strokeWidth="2" />
            
            {/* Arms */}
            <rect x="40" y="84" width="12" height="5" rx="2.5" fill="hsl(var(--muted))" stroke="currentColor"  strokeWidth="1" className="animate-[swing_2s_ease-in-out_infinite] origin-right" />
            <rect x="76" y="84" width="12" height="5" rx="2.5" fill="hsl(var(--muted))" stroke="currentColor"  strokeWidth="1" className="animate-[swing_2s_ease-in-out_infinite] origin-left" />
            
            {/* Legs */}
            <rect x="56" y="108" width="5" height="16" rx="2.5" fill="hsl(var(--muted))" stroke="currentColor"  strokeWidth="1" />
            <rect x="67" y="108" width="5" height="16" rx="2.5" fill="hsl(var(--muted))" stroke="currentColor"  strokeWidth="1" />
          </g>
        </svg>
        
        {/* Floating error icon */}
        <div className="absolute -top-1 -right-1 animate-[bounce_1s_ease-in-out_infinite]">
          <div className={`${errorContent.color} bg-background border-2 border-current rounded-full p-1.5 shadow-lg`}>
            {errorCode >= 502 && errorCode <= 504 ? <WifiOff size={12} /> : <AlertTriangle size={12} />}
          </div>
        </div>
      </div>
    );
  };

  return ( 
    <Card className={`w-full max-w-2xl ml-[170px]  mt-[50px] bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-950/20 dark:to-pink-950/20 rounded-2xl shadow-xl border border-red-200 dark:border-red-800`}>
      <CardContent className="p-8 md:p-12 text-center flex flex-col items-center justify-center text-foreground">
        {/* Animated Character */}
        {renderCharacter()}

        {/* Error Code */}
        <div className={`text-5xl font-bold mb-4 ${errorContent.color} animate-[scale-in_0.5s_ease-out] tracking-tight`}>
          {errorCode}
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-foreground mb-3 animate-[fade-in_0.7s_ease-out]">
          {errorContent.title}
        </h1>

        {/* Error Description */}
        <p className="text-muted-foreground mb-6 leading-relaxed animate-[fade-in_0.9s_ease-out] max-w-sm mx-auto">
          {errorContent.description}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6 animate-[fade-in_1.1s_ease-out]">
          <Button variant="outline" onClick={handleGoHome} className="bg-background/50 hover:bg-background/80">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
          {showRefresh && (
            <Button variant="outline" onClick={handleRefresh} className="bg-background/50 hover:bg-background/80">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Page
            </Button>
          )}
        </div>

        {/* Status indicator */}
        <div className="mt-6 text-sm text-muted-foreground animate-[fade-in_1.3s_ease-out]">
          Status Code: <span className={`font-mono font-bold ${errorContent.color}`}>{errorCode}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServerErrorPage;