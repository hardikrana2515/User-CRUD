import { PencilSimple, Trash, UsersThree, CaretLeft, CaretRight } from '@phosphor-icons/react'

export default function UserTable({ users, currentPage, totalPages, totalRecords, itemsPerPage, onPageChange, onEdit, onDelete }) {
  const startRecord = (currentPage - 1) * itemsPerPage + 1
  const endRecord = Math.min(currentPage * itemsPerPage, totalRecords)

  const getRoleBadge = (role) => {
    const styles = {
      Admin: 'bg-admin/15 text-admin border-admin/30',
      Member: 'bg-member/15 text-member border-member/30',
      Viewer: 'bg-viewer/15 text-viewer border-viewer/30',
    }
    return styles[role] || styles.Member
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-xl">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface-alt/50">
              <th className="px-5 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">ID</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Name</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Email</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Role</th>
              <th className="px-5 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Created At</th>
              <th className="px-5 py-4 text-center text-xs font-semibold text-text-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <UsersThree className="h-12 w-12 text-text-muted/30" weight="thin" />
                    <p className="text-text-muted text-sm">No users found</p>
                    <p className="text-text-muted/50 text-xs">Create a new user or fetch data to get started</p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user, idx) => (
                <tr
                  key={user.id}
                  className={`border-b border-border/50 hover:bg-surface-hover transition-colors duration-150 ${idx % 2 === 0 ? '' : 'bg-surface-alt/20'}`}
                >
                  <td className="px-5 py-4">
                    <span className="text-sm font-mono font-semibold text-primary">#{user.id}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">{user.name?.charAt(0)?.toUpperCase()}</span>
                      </div>
                      <span className="text-sm font-medium text-text">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-text-muted">{user.email}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold border ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-text-muted">{formatDate(user.createdAt)}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(user)}
                        className="p-2 rounded-lg text-warning/70 hover:text-warning hover:bg-warning/10 active:scale-[0.98] transition-all cursor-pointer"
                        title="Edit user"
                      >
                        <PencilSimple className="h-4 w-4" weight="regular" />
                      </button>
                      <button
                        onClick={() => onDelete(user)}
                        className="p-2 rounded-lg text-danger/70 hover:text-danger hover:bg-danger/10 active:scale-[0.98] transition-all cursor-pointer"
                        title="Delete user"
                      >
                        <Trash className="h-4 w-4" weight="regular" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalRecords > 0 && (
        <div className="flex items-center justify-between px-5 py-4 border-t border-border bg-surface-alt/30">
          <p className="text-sm text-text-muted">
            Showing <span className="font-semibold text-text">{startRecord}-{endRecord}</span> of{' '}
            <span className="font-semibold text-text">{totalRecords}</span> records
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium border border-border text-text-muted hover:text-text hover:bg-surface-hover active:scale-[0.98] transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <CaretLeft className="h-4 w-4" weight="regular" />
              Prev
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all cursor-pointer
                  ${page === currentPage
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'text-text-muted hover:text-text hover:bg-surface-hover border border-border'
                  }
                `}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium border border-border text-text-muted hover:text-text hover:bg-surface-hover active:scale-[0.98] transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
              <CaretRight className="h-4 w-4" weight="regular" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
