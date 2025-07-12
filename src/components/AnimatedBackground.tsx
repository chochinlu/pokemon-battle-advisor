export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 opacity-20">
      <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-red-400 rounded-full blur-lg animate-bounce"></div>
      <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-blue-400 rounded-full blur-2xl animate-pulse delay-1000"></div>
    </div>
  )
} 