'use client';

interface TopNavbarProps {
  userRole: 'admin' | 'trainee';
  userName: string;
}

export function TopNavbar({ userRole, userName }: TopNavbarProps) {
  return (
    <header className="h-20 bg-card/80 backdrop-blur-md border-b border-border flex items-center justify-between px-8 ml-72 fixed right-0 top-0 left-72 z-40 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">AI</span>
          </div>
          <div>
            <h2 className="font-bold text-foreground text-lg">VR Paramedics Training</h2>
            <p className="text-xs text-muted-foreground">AI-Powered Medical Simulation Platform</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* User Profile */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-muted/50 border border-border">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-foreground">{userName}</p>
            <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
