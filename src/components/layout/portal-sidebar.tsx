'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandMark } from './brand-mark';
import {
  LayoutDashboard,
  Users,
  FileText,
  Award,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Check,
  Menu,
  X,
  GraduationCap,
  ClipboardList,
  CalendarDays,
  LineChart,
  CalendarCheck,
  TrendingUp,
  FolderArchive,
  GitCompare,
  Sparkles,
} from 'lucide-react';
import { logout } from '@/features/auth/actions';

interface PortalSidebarProps {
  userEmail: string;
  userName: string;
  roles: string[];
}

const ROLE_DISPLAY: Record<string, string> = {
  admin: 'Super Admin',
  coordinator: 'QA Coordinator',
  evaluator: 'Auditor & Evaluator',
  faculty: 'Area Faculty Lead',
};

export function PortalSidebar({ userEmail, userName, roles }: PortalSidebarProps) {
  const pathname = usePathname();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const currentRole = pathname.startsWith('/admin')
    ? 'admin'
    : pathname.startsWith('/coordinator')
    ? 'coordinator'
    : pathname.startsWith('/evaluator')
    ? 'evaluator'
    : pathname.startsWith('/faculty')
    ? 'faculty'
    : roles[0] || 'admin';

  const handleNavClick = () => {
    setIsMobileOpen(false);
  };

  const linkClass = (path: string) => {
    const isActive = pathname === path;
    return `flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-control)] text-xs transition-colors duration-150 ${
      isActive
        ? 'bg-[#800000] text-white font-medium shadow-xs dark:bg-[#800000] dark:text-white'
        : 'text-[var(--text-secondary)] font-medium hover:text-[var(--foreground)] hover:bg-[var(--surface-muted)]'
    }`;
  };

  const iconClass = (path: string) => {
    const isActive = pathname === path;
    return `w-4 h-4 shrink-0 stroke-[1.75] ${isActive ? 'text-white' : 'text-[var(--text-muted)]'}`;
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden sticky top-0 z-40 bg-[var(--surface)] border-b border-[var(--border)] px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <BrandMark variant="seal" size={28} />
          <span className="font-[family-name:var(--font-display)] font-bold text-sm text-[var(--foreground)] tracking-tight">
            ZPPSU OAMS
          </span>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-1.5 rounded-[var(--radius-control)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--foreground)]"
          aria-label="Toggle navigation"
        >
          {isMobileOpen ? <X className="w-5 h-5 stroke-[1.75]" /> : <Menu className="w-5 h-5 stroke-[1.75]" />}
        </button>
      </div>

      {/* Main Sidebar (Desktop fixed, Mobile sliding drawer) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[var(--surface)] border-r border-[var(--border)] flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Workspace Switcher / Institution Brand */}
          <div className="p-3.5 border-b border-[var(--border-subtle)] relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="w-full flex items-center justify-between p-2 rounded-[var(--radius-control)] hover:bg-[var(--surface-muted)] transition-colors group text-left border border-[var(--border)]"
            >
              <div className="flex items-center gap-2.5">
                <BrandMark variant="seal" size={32} />
                <div className="leading-tight">
                  <span className="block text-xs font-bold font-[family-name:var(--font-display)] tracking-tight text-[var(--foreground)] group-hover:text-[#800000]">
                    ZPPSU OAMS
                  </span>
                  <span className="block text-[11px] text-[var(--text-muted)]">
                    {ROLE_DISPLAY[currentRole] ?? 'Portal'} workspace
                  </span>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] stroke-[1.75]" />
            </button>

            {/* Role Switcher Popover Menu */}
            {isRoleDropdownOpen && (
              <div className="absolute top-16 left-4 right-4 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-panel)] shadow-[var(--shadow-floating)] p-2 z-50">
                <span className="text-[11px] font-medium text-[var(--text-muted)] px-2 py-1 block">
                  Switch workspace
                </span>
                <div className="space-y-0.5 mt-1">
                  {roles.map((r) => {
                    const isActive = currentRole === r;
                    return (
                      <Link
                        key={r}
                        href={`/${r}`}
                        onClick={() => setIsRoleDropdownOpen(false)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[var(--radius-control)] text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-[var(--accent-subtle)] text-[var(--accent)] font-medium'
                            : 'text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-muted)]'
                        }`}
                      >
                        <span>{ROLE_DISPLAY[r] ?? r}</span>
                        {isActive && <Check className="w-3.5 h-3.5 text-[var(--accent)] stroke-[1.75]" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-3 space-y-4" onClick={handleNavClick}>
            {/* Common Workspace Overview Link */}
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block">
                Workspace
              </span>
              <nav className="space-y-0.5 pt-0.5">
                <Link href={`/${currentRole}`} className={linkClass(`/${currentRole}`)}>
                  <LayoutDashboard className={iconClass(`/${currentRole}`)} />
                  <span>Overview</span>
                </Link>
              </nav>
            </div>

            {/* ADMIN MODULES */}
            {currentRole === 'admin' && (
              <>
                <div className="space-y-1">
                  <span className="px-3 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block">
                    Programs & Rules
                  </span>
                  <nav className="space-y-0.5 pt-0.5">
                    <Link href="/admin/programs" className={linkClass('/admin/programs')}>
                      <GraduationCap className={iconClass('/admin/programs')} />
                      <span>Programs & Courses</span>
                    </Link>
                    <Link href="/admin/framework" className={linkClass('/admin/framework')}>
                      <ClipboardList className={iconClass('/admin/framework')} />
                      <span>Accreditation Standards</span>
                    </Link>
                    <Link href="/admin/crosswalk" className={linkClass('/admin/crosswalk')}>
                      <GitCompare className={iconClass('/admin/crosswalk')} />
                      <span>Standard Mappings</span>
                    </Link>
                  </nav>
                </div>

                <div className="space-y-1">
                  <span className="px-3 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block">
                    Survey Visits
                  </span>
                  <nav className="space-y-0.5 pt-0.5">
                    <Link href="/admin/cycles" className={linkClass('/admin/cycles')}>
                      <CalendarDays className={iconClass('/admin/cycles')} />
                      <span>Survey Periods</span>
                    </Link>
                    <Link href="/admin/timeline" className={linkClass('/admin/timeline')}>
                      <CalendarCheck className={iconClass('/admin/timeline')} />
                      <span>Calendar & Deadlines</span>
                    </Link>
                    <Link href="/admin/mock-survey" className={linkClass('/admin/mock-survey')}>
                      <Sparkles className={iconClass('/admin/mock-survey')} />
                      <span>Practice Survey</span>
                    </Link>
                    <Link href="/admin/reviews" className={linkClass('/admin/reviews')}>
                      <ShieldCheck className={iconClass('/admin/reviews')} />
                      <span>Survey Reviews</span>
                    </Link>
                  </nav>
                </div>

                <div className="space-y-1">
                  <span className="px-3 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block">
                    Reports & Files
                  </span>
                  <nav className="space-y-0.5 pt-0.5">
                    <Link href="/admin/compliance" className={linkClass('/admin/compliance')}>
                      <LineChart className={iconClass('/admin/compliance')} />
                      <span>Compliance Progress</span>
                    </Link>
                    <Link href="/admin/dossier" className={linkClass('/admin/dossier')}>
                      <FolderArchive className={iconClass('/admin/dossier')} />
                      <span>Report Binder</span>
                    </Link>
                    <Link href="/admin/cqi" className={linkClass('/admin/cqi')}>
                      <TrendingUp className={iconClass('/admin/cqi')} />
                      <span>Action Plans</span>
                    </Link>
                  </nav>
                </div>

                <div className="space-y-1">
                  <span className="px-3 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block">
                    User Access
                  </span>
                  <nav className="space-y-0.5 pt-0.5">
                    <Link href="/admin/users" className={linkClass('/admin/users')}>
                      <Users className={iconClass('/admin/users')} />
                      <span>Users & Roles</span>
                    </Link>
                  </nav>
                </div>
              </>
            )}

            {/* COORDINATOR MODULES */}
            {currentRole === 'coordinator' && (
              <>
                <div className="space-y-1">
                  <span className="px-3 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block">
                    Survey Visits
                  </span>
                  <nav className="space-y-0.5 pt-0.5">
                    <Link href="/coordinator/reviews" className={linkClass('/coordinator/reviews')}>
                      <ShieldCheck className={iconClass('/coordinator/reviews')} />
                      <span>Survey Reviews</span>
                    </Link>
                    <Link href="/coordinator/timeline" className={linkClass('/coordinator/timeline')}>
                      <CalendarCheck className={iconClass('/coordinator/timeline')} />
                      <span>Calendar & Deadlines</span>
                    </Link>
                    <Link href="/coordinator/mock-survey" className={linkClass('/coordinator/mock-survey')}>
                      <Sparkles className={iconClass('/coordinator/mock-survey')} />
                      <span>Practice Survey</span>
                    </Link>
                  </nav>
                </div>

                <div className="space-y-1">
                  <span className="px-3 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block">
                    Reports & Files
                  </span>
                  <nav className="space-y-0.5 pt-0.5">
                    <Link href="/coordinator/compliance" className={linkClass('/coordinator/compliance')}>
                      <LineChart className={iconClass('/coordinator/compliance')} />
                      <span>Compliance Progress</span>
                    </Link>
                    <Link href="/coordinator/dossier" className={linkClass('/coordinator/dossier')}>
                      <FolderArchive className={iconClass('/coordinator/dossier')} />
                      <span>Report Binder</span>
                    </Link>
                    <Link href="/coordinator/crosswalk" className={linkClass('/coordinator/crosswalk')}>
                      <GitCompare className={iconClass('/coordinator/crosswalk')} />
                      <span>Standard Mappings</span>
                    </Link>
                    <Link href="/coordinator/cqi" className={linkClass('/coordinator/cqi')}>
                      <TrendingUp className={iconClass('/coordinator/cqi')} />
                      <span>Action Plans</span>
                    </Link>
                  </nav>
                </div>
              </>
            )}

            {/* EVALUATOR MODULES */}
            {currentRole === 'evaluator' && (
              <div className="space-y-1">
                <span className="px-3 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block">
                  Evaluations
                </span>
                <nav className="space-y-0.5 pt-0.5">
                  <Link href="/evaluator/reviews" className={linkClass('/evaluator/reviews')}>
                    <Award className={iconClass('/evaluator/reviews')} />
                    <span>Score & Review</span>
                  </Link>
                  <Link href="/evaluator/mock-survey" className={linkClass('/evaluator/mock-survey')}>
                    <Sparkles className={iconClass('/evaluator/mock-survey')} />
                    <span>Practice Survey</span>
                  </Link>
                </nav>
              </div>
            )}

            {/* FACULTY MODULES */}
            {currentRole === 'faculty' && (
              <div className="space-y-1">
                <span className="px-3 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block">
                  My Submissions
                </span>
                <nav className="space-y-0.5 pt-0.5">
                  <Link href="/faculty/assignments" className={linkClass('/faculty/assignments')}>
                    <ClipboardList className={iconClass('/faculty/assignments')} />
                    <span>My Tasks</span>
                  </Link>
                  <Link href="/faculty/documents" className={linkClass('/faculty/documents')}>
                    <FileText className={iconClass('/faculty/documents')} />
                    <span>Uploaded Files</span>
                  </Link>
                </nav>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Bottom Utilities & User Session Profile */}
        <div className="p-3 border-t border-[var(--border-subtle)] space-y-2">
          <div className="flex items-center justify-between p-2 rounded-[var(--radius-control)] bg-[var(--surface-muted)] border border-[var(--border)]">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-7 h-7 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-medium text-xs shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="truncate leading-tight">
                <span className="block text-xs font-medium text-[var(--foreground)] truncate">
                  {userName}
                </span>
                <span className="block text-[11px] text-[var(--text-muted)] truncate">
                  {userEmail}
                </span>
              </div>
            </div>

            <form action={logout}>
              <button
                type="submit"
                title="Sign out"
                aria-label="Sign out"
                className="p-1.5 rounded-[var(--radius-control)] text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--surface)] transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 stroke-[1.75]" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-xs md:hidden"
        />
      )}
    </>
  );
}
