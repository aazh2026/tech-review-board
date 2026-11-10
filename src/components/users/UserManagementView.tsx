import React, { useState, useEffect } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { SystemUser, GovernanceRole } from '../../types';
import { DRBOrgView } from '../drb/DRBOrgView';
import {
  Users,
  UserCheck,
  Shield,
  Key,
  RefreshCw,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Building2,
  Briefcase,
  UserCog,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Award,
  History,
  FileText,
  Activity,
  Terminal,
  Network,
  Flame,
} from 'lucide-react';

export const UserManagementView: React.FC = () => {
  const {
    users,
    roles,
    permissions,
    drbOrgs,
    auditLogs,
    logAuditEvent,
    adminNav,
    setAdminNav,
    setWorkspaceMode,
    addUser,
    updateUser,
    toggleUserStatus,
    syncFromEnterpriseDirectory,
    updateRolePermissions,
    assignUserRoles,
    switchPersonaByUser,
    currentPersona,
  } = useGovernance();

  // Tab state synced with adminNav
  const mapAdminNavToTab = (nav: string): 'users' | 'roles' | 'drb' | 'appointments' | 'audit' => {
    if (nav === 'admin-roles') return 'roles';
    if (nav === 'admin-drb') return 'drb';
    if (nav === 'admin-appointments') return 'appointments';
    if (nav === 'admin-audit') return 'audit';
    return 'users';
  };

  const mapTabToAdminNav = (tab: string): 'admin-users' | 'admin-roles' | 'admin-drb' | 'admin-appointments' | 'admin-audit' => {
    if (tab === 'roles') return 'admin-roles';
    if (tab === 'drb') return 'admin-drb';
    if (tab === 'appointments') return 'admin-appointments';
    if (tab === 'audit') return 'admin-audit';
    return 'admin-users';
  };

  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'drb' | 'appointments' | 'audit'>(
    mapAdminNavToTab(adminNav)
  );

  useEffect(() => {
    setActiveTab(mapAdminNavToTab(adminNav));
  }, [adminNav]);

  const handleTabChange = (tab: 'users' | 'roles' | 'drb' | 'appointments' | 'audit') => {
    setActiveTab(tab);
    setAdminNav(mapTabToAdminNav(tab));
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');

  // Audit log filters
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [selectedAuditLevel, setSelectedAuditLevel] = useState<'ALL' | 'INFO' | 'WARN' | 'CRITICAL'>('ALL');
  const [selectedAuditType, setSelectedAuditType] = useState<string>('ALL');

  // Selected role for permission matrix
  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0].id);
  const selectedRole = roles.find((r) => r.id === selectedRoleId) || roles[0];
  const [editingPermissions, setEditingPermissions] = useState<string[]>(selectedRole.permissions);

  // New user modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmpNo, setNewUserEmpNo] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserDept, setNewUserDept] = useState('营销服务研发中心');
  const [newUserProductFamily, setNewUserProductFamily] = useState('智能营销产品族');
  const [newUserJobTitle, setNewUserJobTitle] = useState('资深架构师');
  const [newUserLevel, setNewUserLevel] = useState('T8 - 资深架构师');
  const [newUserSource, setNewUserSource] = useState<'FEISHU_SSO' | 'LDAP_AD' | 'WECHAT_WORK' | 'LOCAL_ADMIN'>('FEISHU_SSO');
  const [newUserRoleCodes, setNewUserRoleCodes] = useState<string[]>(['TOPIC_OWNER']);

  // Role Assignment Modal
  const [showRoleAssignModal, setShowRoleAssignModal] = useState(false);
  const [targetAssignUser, setTargetAssignUser] = useState<SystemUser | null>(null);
  const [tempUserRoles, setTempUserRoles] = useState<string[]>([]);

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.employeeNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDepartment === 'ALL' || u.department === selectedDepartment;
    const matchesRole = selectedRoleFilter === 'ALL' || u.roleCodes.includes(selectedRoleFilter);

    return matchesSearch && matchesDept && matchesRole;
  });

  const departments = Array.from(new Set(users.map((u) => u.department)));

  const handleRoleSelect = (roleId: string) => {
    setSelectedRoleId(roleId);
    const r = roles.find((item) => item.id === roleId);
    if (r) {
      setEditingPermissions(r.permissions);
    }
  };

  const togglePermission = (permCode: string) => {
    if (editingPermissions.includes(permCode)) {
      setEditingPermissions(editingPermissions.filter((p) => p !== permCode));
    } else {
      setEditingPermissions([...editingPermissions, permCode]);
    }
  };

  const handleSavePermissions = () => {
    updateRolePermissions(selectedRole.id, editingPermissions);
    logAuditEvent({
      eventType: 'PERM_UPDATE',
      eventTypeName: '角色权限边界调整',
      targetEntity: `角色 ${selectedRole.name} (${selectedRole.code})`,
      detail: `保存 ${selectedRole.name} 的法定权限配置，现配置生效 ${editingPermissions.length} 项法定权能。`,
      level: 'WARN',
    });
  };

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmpNo.trim()) return;

    addUser({
      name: newUserName,
      employeeNo: newUserEmpNo,
      email: newUserEmail || `${newUserEmpNo.toLowerCase()}@corp.internal`,
      department: newUserDept,
      productFamily: newUserProductFamily,
      jobTitle: newUserJobTitle,
      technicalLevel: newUserLevel,
      ssoSource: newUserSource,
      roleCodes: newUserRoleCodes,
      roleLabels: newUserRoleCodes.map((c) => roles.find((r) => r.code === c)?.name || c),
    });

    logAuditEvent({
      eventType: 'USER_CREATE',
      eventTypeName: '架构师档案录入与授权',
      targetEntity: `${newUserName} (${newUserEmpNo})`,
      detail: `录入新用户档案，部门：${newUserDept}，职级：${newUserLevel}，分配角色：${newUserRoleCodes.join(' · ')}。`,
      level: 'INFO',
    });

    setShowAddModal(false);
    setNewUserName('');
    setNewUserEmpNo('');
    setNewUserEmail('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>技术评审与决策管理平台</span>
            <span>/</span>
            <span className="text-amber-600 dark:text-amber-400 font-semibold">系统管理后台 (Admin Console)</span>
            <span>/</span>
            <span className="text-slate-900 dark:text-slate-100 font-medium">
              {activeTab === 'users' && '员工与架构师档案'}
              {activeTab === 'roles' && 'DRB 法定角色与权限矩阵 (RBAC)'}
              {activeTab === 'drb' && 'DRB 组织架构与授权宪章'}
              {activeTab === 'appointments' && '委员会任免履职台账'}
              {activeTab === 'audit' && '安全操作与审计流水'}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-500" />
            <span>系统管理与组织授权治理中心</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            企业通讯录SSO同步 · 架构技术职级(T序列) · DRB法定权能矩阵(RBAC) · 三级委员会宪章 · 安全审计流水
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'users' && (
            <>
              <button
                type="button"
                onClick={syncFromEnterpriseDirectory}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-indigo-500" />
                <span>同步企业通讯录 (LDAP/飞书)</span>
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-950 rounded-lg hover:bg-slate-800 transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>录入系统用户</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 5 Main Admin Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs font-semibold overflow-x-auto">
        {[
          { key: 'users', label: `员工与架构师档案 (${users.length})`, icon: Users },
          { key: 'roles', label: `DRB 法定角色与权限矩阵 (${roles.length})`, icon: ShieldCheck },
          { key: 'drb', label: `DRB 组织架构与授权宪章 (${drbOrgs.length})`, icon: Network },
          { key: 'appointments', label: '委员会任免履职台账', icon: Award },
          { key: 'audit', label: `安全操作与审计流水 (${auditLogs.length})`, icon: History },
        ].map((t) => {
          const isActive = activeTab === t.key;
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => handleTabChange(t.key as any)}
              className={`px-4 py-2.5 transition-colors relative border-b-2 -mb-[1px] flex items-center gap-1.5 whitespace-nowrap ${
                isActive
                  ? 'border-slate-900 dark:border-white text-slate-950 dark:text-white font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: User Directory */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索工号、姓名、邮箱、岗位职务..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-xs"
                />
              </div>

              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              >
                <option value="ALL">全部部门 / 中心</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              >
                <option value="ALL">全部法定角色</option>
                {roles.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-slate-400 text-[11px] whitespace-nowrap">
              共筛选出 <strong className="text-slate-800 dark:text-slate-200">{filteredUsers.length}</strong> 位用户
            </div>
          </div>

          {/* User Table */}
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                  <th className="py-3 px-4">架构师 / 账号</th>
                  <th className="py-3 px-4">所属部门与产品族</th>
                  <th className="py-3 px-4">岗位与技术职级</th>
                  <th className="py-3 px-4">DRB 法定角色</th>
                  <th className="py-3 px-4">账号来源</th>
                  <th className="py-3 px-4">状态</th>
                  <th className="py-3 px-4 text-right">管理操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((user) => {
                  const isCurrent = currentPersona.id === user.id;

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center font-bold text-xs shrink-0">
                            {user.avatarText}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                              <span>{user.name}</span>
                              {isCurrent && (
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                                  当前执行中
                                </span>
                              )}
                            </div>
                            <div className="font-mono text-[11px] text-slate-400">
                              {user.employeeNo} · {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                        <div className="font-medium">{user.department}</div>
                        <div className="text-[11px] text-slate-400">{user.productFamily}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{user.jobTitle}</div>
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 inline-block mt-0.5">
                          {user.technicalLevel}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {user.roleLabels.map((rl, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-medium px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                            >
                              {rl}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {user.ssoSource === 'LDAP_AD'
                            ? '企业AD/LDAP'
                            : user.ssoSource === 'FEISHU_SSO'
                            ? '飞书单点登录'
                            : user.ssoSource === 'WECHAT_WORK'
                            ? '企业微信'
                            : '本地录入'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <span
                          className={`font-semibold ${
                            user.status === 'ACTIVE'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {user.status === 'ACTIVE' ? '在职正常' : '已停用'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => switchPersonaByUser(user)}
                            className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 hover:bg-slate-800 transition-colors shadow-xs"
                          >
                            以此身份代入
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setTargetAssignUser(user);
                              setTempUserRoles(user.roleCodes);
                              setShowRoleAssignModal(true);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300"
                          >
                            角色委派
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleUserStatus(user.id)}
                            className="text-xs text-slate-400 hover:text-rose-600 px-1"
                            title={user.status === 'ACTIVE' ? '停用账号' : '激活账号'}
                          >
                            {user.status === 'ACTIVE' ? '冻结' : '解冻'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Role & Permission Matrix */}
      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Role List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>DRB 法定角色体系 ({roles.length})</span>
              <span className="text-[11px] text-slate-400">分级治理预设</span>
            </div>

            <div className="space-y-2">
              {roles.map((r) => {
                const isSelected = r.id === selectedRoleId;

                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleSelect(r.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md ring-2 ring-indigo-500/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{r.name}</span>
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          isSelected
                            ? 'bg-indigo-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {r.code}
                      </span>
                    </div>

                    <p
                      className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${
                        isSelected ? 'text-slate-300 dark:text-slate-600' : 'text-slate-500'
                      }`}
                    >
                      {r.description}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-slate-200/40 dark:border-slate-700/40 flex items-center justify-between text-[10px]">
                      <span>管辖层级：{r.scopeLevel}</span>
                      <span>拥有权限：{r.permissions.length} 项</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right 2 Columns: Permission Matrix Editor */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {selectedRole.code}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs font-semibold text-slate-500">{selectedRole.scopeLevel}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {selectedRole.name} 权限清单与权力边界配置
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={handleSavePermissions}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-xs"
                >
                  保存权限配置
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <strong>权力边界与三权分立原则 (BR-025/BR-033)：</strong>
                <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[11px]">
                  <li>评审权与表决权分离：非委员会正式任命专家仅可发表审查意见，不可行使无记名表决票。</li>
                  <li>整改人独立回避红线：方案主讲人（TOPIC_OWNER）严禁被赋予独立整改验证权（remediation:verify）。</li>
                  <li>终局裁决权：只有企业级或产品族级 DRB 主席拥有签署正式生效决策书权限。</li>
                </ul>
              </div>

              {/* Grouped Permissions */}
              <div className="space-y-4 text-xs">
                {['TOPIC_MANAGEMENT', 'MEETING_VOTING', 'DECISION_ADR', 'REMEDIATION_VERIFICATION', 'SYSTEM_AUTH'].map(
                  (catKey) => {
                    const categoryPerms = permissions.filter((p) => p.category === catKey);
                    const categoryLabel = categoryPerms[0]?.categoryLabel || catKey;

                    return (
                      <div key={catKey} className="space-y-2">
                        <div className="font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-1 flex items-center justify-between">
                          <span>{categoryLabel}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {categoryPerms.filter((p) => editingPermissions.includes(p.code)).length} /{' '}
                            {categoryPerms.length} 项已授权
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {categoryPerms.map((perm) => {
                            const isChecked = editingPermissions.includes(perm.code);

                            return (
                              <label
                                key={perm.code}
                                className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                                  isChecked
                                    ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/60'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => togglePermission(perm.code)}
                                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                                />
                                <div>
                                  <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                    <span>{perm.name}</span>
                                    <span className="font-mono text-[10px] text-slate-400">
                                      ({perm.code})
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                                    {perm.description}
                                  </p>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Appointments & Terms */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between text-xs">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100">
                DRB 委员会委员法定任免与履职台账 (BR-001)
              </h3>
              <p className="text-slate-500 text-[11px] mt-0.5">
                记录架构委员会主席、秘书长、常务委员、专项专家组长的正式任命周期与换届记录。
              </p>
            </div>
            <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              任期制 · 两年一届
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {users
              .filter((u) => u.drbAppointments.length > 0)
              .map((u) => (
                <div
                  key={u.id}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                        {u.avatarText}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100">{u.name}</div>
                        <div className="text-[10px] text-slate-400">{u.department}</div>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                      {u.technicalLevel}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {u.drbAppointments.map((app, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-slate-100">
                            {app.drbName}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            {app.drbRole}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          任期：{app.termPeriod}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tab 3: DRB Org Hierarchy & Authorization Charters */}
      {activeTab === 'drb' && <DRBOrgView />}

      {/* Tab 5: Security Audit Log Trails */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          {/* Audit Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>累计安全审计日志</span>
                <History className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-2">
                {auditLogs.length}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">全链路防篡改区块链式流水</div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>高危基线/决策签署 (CRITICAL)</span>
                <Flame className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-2">
                {auditLogs.filter((a) => a.level === 'CRITICAL').length}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">红线规则固化与法定裁决签署</div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>权限与权能调整 (WARN)</span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-2">
                {auditLogs.filter((a) => a.level === 'WARN').length}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">RBAC权限矩阵与账号状态变更</div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>同步与常规委派 (INFO)</span>
                <Activity className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-2">
                {auditLogs.filter((a) => a.level === 'INFO').length}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">LDAP同步/在册角色正常委派</div>
            </div>
          </div>

          {/* Audit Filter Bar */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索操作人、目标对象、事件类型或审计依据..."
                  value={auditSearchQuery}
                  onChange={(e) => setAuditSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 focus:bg-white text-xs"
                />
              </div>

              {/* Level Filter Buttons */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                {[
                  { key: 'ALL', label: '全部级别' },
                  { key: 'CRITICAL', label: '关键高危' },
                  { key: 'WARN', label: '警告变更' },
                  { key: 'INFO', label: '常规信息' },
                ].map((lvl) => (
                  <button
                    key={lvl.key}
                    type="button"
                    onClick={() => setSelectedAuditLevel(lvl.key as any)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                      selectedAuditLevel === lvl.key
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono">
              <Terminal className="w-3.5 h-3.5" />
              <span>防篡改审计日志 · 保留期 5 年</span>
            </div>
          </div>

          {/* Audit Log Table */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                    <th className="py-3 px-4 w-44">操作时间戳</th>
                    <th className="py-3 px-4 w-28">事件级别</th>
                    <th className="py-3 px-4 w-44">事件类别</th>
                    <th className="py-3 px-4 w-36">操作人</th>
                    <th className="py-3 px-4 w-52">变更实体/目标</th>
                    <th className="py-3 px-4 min-w-[280px]">变更内容与治理依据</th>
                    <th className="py-3 px-4 w-32 font-mono">客户端IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {auditLogs
                    .filter((log) => {
                      const q = auditSearchQuery.toLowerCase();
                      const matchesSearch =
                        !q ||
                        log.operatorName.toLowerCase().includes(q) ||
                        log.operatorRole.toLowerCase().includes(q) ||
                        log.targetEntity.toLowerCase().includes(q) ||
                        log.detail.toLowerCase().includes(q) ||
                        log.eventTypeName.toLowerCase().includes(q) ||
                        log.clientIp.includes(q);
                      const matchesLevel =
                        selectedAuditLevel === 'ALL' || log.level === selectedAuditLevel;
                      return matchesSearch && matchesLevel;
                    })
                    .map((log) => (
                      <tr
                        key={log.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                          {log.timestamp}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] inline-flex items-center gap-1 ${
                              log.level === 'CRITICAL'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 ring-1 ring-rose-500/30'
                                : log.level === 'WARN'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {log.level === 'CRITICAL' && <Flame className="w-2.5 h-2.5" />}
                            {log.level === 'WARN' && <AlertTriangle className="w-2.5 h-2.5" />}
                            {log.level === 'INFO' && <Activity className="w-2.5 h-2.5" />}
                            <span>{log.level}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            {log.eventTypeName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {log.eventType}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-900 dark:text-slate-100">
                            {log.operatorName}
                          </div>
                          <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono">
                            {log.operatorRole}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-xs text-slate-700 dark:text-slate-300 font-medium">
                            {log.targetEntity}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                          {log.detail}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                          {log.clientIp}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add System User */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <UserCog className="w-5 h-5 text-indigo-500" />
                <span>录入新架构师档案与授权 (新用户)</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">员工真实姓名 *</label>
                  <input
                    type="text"
                    required
                    placeholder="如：王大伟"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">企业工号 (Employee ID) *</label>
                  <input
                    type="text"
                    required
                    placeholder="如：EMP-3890"
                    value={newUserEmpNo}
                    onChange={(e) => setNewUserEmpNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">所属中心 / 部门</label>
                  <input
                    type="text"
                    value={newUserDept}
                    onChange={(e) => setNewUserDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">技术职级 (T序列)</label>
                  <select
                    value={newUserLevel}
                    onChange={(e) => setNewUserLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="T10 - 特级架构专家">T10 - 特级架构专家</option>
                    <option value="T9 - 首席专家">T9 - 首席专家</option>
                    <option value="T8 - 资深架构师">T8 - 资深架构师</option>
                    <option value="T7 - 架构高级专员">T7 - 架构高级专员</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">分配 DRB 法定角色</label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((r) => (
                    <label
                      key={r.code}
                      className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-2 cursor-pointer bg-slate-50 dark:bg-slate-800/40 text-[11px]"
                    >
                      <input
                        type="checkbox"
                        checked={newUserRoleCodes.includes(r.code)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewUserRoleCodes([...newUserRoleCodes, r.code]);
                          } else {
                            setNewUserRoleCodes(newUserRoleCodes.filter((c) => c !== r.code));
                          }
                        }}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{r.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">账号源</label>
                <select
                  value={newUserSource}
                  onChange={(e) => setNewUserSource(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="FEISHU_SSO">飞书 SSO 单点登录</option>
                  <option value="LDAP_AD">企业 LDAP / Active Directory</option>
                  <option value="WECHAT_WORK">企业微信</option>
                  <option value="LOCAL_ADMIN">本地管理员账号</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-100"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-950 hover:bg-slate-800 shadow-xs"
                >
                  确认录入用户
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Role Assignment */}
      {showRoleAssignModal && targetAssignUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              调整用户角色与法定权能：{targetAssignUser.name} ({targetAssignUser.employeeNo})
            </h3>
            <p className="text-slate-500">
              选择需要赋予该架构师的 DRB 法定治理角色。权限配置将立即生效。
            </p>

            <div className="space-y-2">
              {roles.map((r) => (
                <label
                  key={r.code}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex items-start gap-2.5 cursor-pointer bg-slate-50 dark:bg-slate-800/40"
                >
                  <input
                    type="checkbox"
                    checked={tempUserRoles.includes(r.code)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setTempUserRoles([...tempUserRoles, r.code]);
                      } else {
                        setTempUserRoles(tempUserRoles.filter((c) => c !== r.code));
                      }
                    }}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{r.name}</div>
                    <div className="text-[11px] text-slate-500">{r.description}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowRoleAssignModal(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-100"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  assignUserRoles(targetAssignUser.id, tempUserRoles);
                  setShowRoleAssignModal(false);
                }}
                className="px-4 py-1.5 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-500"
              >
                确认委派
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
