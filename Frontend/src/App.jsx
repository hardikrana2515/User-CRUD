import { useState, useEffect } from 'react'
import { api } from './api'
import { UsersThree, Plus, ArrowsClockwise, MagnifyingGlass, Funnel } from '@phosphor-icons/react'
import UserTable from './components/UserTable'
import CreateUserModal from './components/CreateUserModal'
import EditUserModal from './components/EditUserModal'
import DeleteConfirmModal from './components/DeleteConfirmModal'
import Toast from './components/Toast'
import './App.css'

const ITEMS_PER_PAGE = 5

function App() {
  const [users, setUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchId, setSearchId] = useState('')
  const [filteredUsers, setFilteredUsers] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Toast state
  const [toast, setToast] = useState(null)

  // Fetch users on mount
  useEffect(() => {
    fetchAllUsers()
  }, [])

  const fetchAllUsers = async () => {
    setIsLoading(true)
    try {
      const data = await api.getAllUsers()
      setUsers(data)
      setFilteredUsers(null)
      setSearchId('')
    } catch (err) {
      setToast({ message: err.message, type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  // Which users to display
  const displayUsers = filteredUsers !== null ? filteredUsers : users
  const totalRecords = displayUsers.length
  const totalPages = Math.max(1, Math.ceil(totalRecords / ITEMS_PER_PAGE))
  const paginatedUsers = displayUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleFetchAll = async () => {
    await fetchAllUsers()
    setCurrentPage(1)
    setToast({ message: `Fetched ${users.length} users successfully`, type: 'success' })
  }

  const handleSearch = async () => {
    if (!searchId.trim()) {
      setFilteredUsers(null)
      setCurrentPage(1)
      return
    }
    const id = parseInt(searchId)
    if (isNaN(id)) {
      setToast({ message: 'Please enter a valid numeric ID', type: 'error' })
      return
    }
    try {
      const result = await api.getUserById(id)
      // result has { users: {...}, message: "..." }
      setFilteredUsers([result.users])
      setCurrentPage(1)
    } catch (err) {
      setToast({ message: err.message, type: 'error' })
      setFilteredUsers([])
      setCurrentPage(1)
    }
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  const handleCreateSuccess = async () => {
    // Refetch all users to get fresh data from Supabase
    await fetchAllUsers()
    setToast({ message: 'User created successfully!', type: 'success' })
  }

  const handleEditClick = (user) => {
    setSelectedUser(user)
    setShowEditModal(true)
  }

  const handleEditSuccess = async () => {
    // Refetch all users to get fresh data from Supabase
    await fetchAllUsers()
    setToast({ message: 'User updated successfully!', type: 'success' })
  }

  const handleDeleteClick = (user) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    // Refetch all users to get fresh data from Supabase
    await fetchAllUsers()
    // Adjust page if needed
    const newTotalPages = Math.max(1, Math.ceil((users.length) / ITEMS_PER_PAGE))
    if (currentPage > newTotalPages) setCurrentPage(newTotalPages)
    setToast({ message: 'User deleted successfully!', type: 'success' })
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <UsersThree className="h-5 w-5 text-primary" weight="regular" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text tracking-tight">User Management Module</h1>
              <p className="text-sm text-text-muted">Manage, create, and organize your users</p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          {/* Left actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-hover active:scale-[0.98] transition-all shadow-lg shadow-primary/20 cursor-pointer"
            >
              <Plus className="h-4 w-4" weight="bold" />
              Create User
            </button>
            <button
              onClick={handleFetchAll}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:text-text bg-surface border border-border hover:border-primary/40 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            >
              <ArrowsClockwise className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} weight="regular" />
              Fetch All Data
            </button>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted/50" weight="regular" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Find by ID..."
                className="w-full sm:w-44 pl-10 pr-4 py-2.5 rounded-lg text-sm bg-surface border border-border text-text placeholder:text-text-muted/50 outline-none transition-all focus:ring-2 focus:ring-primary/40 hover:border-primary/40"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-primary/80 hover:bg-primary active:scale-[0.98] transition-all cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>

        {/* Filter indicator */}
        {filteredUsers !== null && (
          <div className="flex items-center gap-2 mb-4 px-4 py-2.5 rounded-lg bg-primary/10 border border-primary/20">
            <Funnel className="h-4 w-4 text-primary" weight="regular" />
            <span className="text-sm text-primary">
              Filtered by ID: {searchId} ({filteredUsers.length} result{filteredUsers.length !== 1 ? 's' : ''})
            </span>
            <button
              onClick={handleFetchAll}
              className="ml-auto text-xs text-primary hover:text-primary-hover underline cursor-pointer"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* Loading state - skeletal table loader */}
        {isLoading && users.length === 0 ? (
          <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-xl">
            {/* Skeleton header */}
            <div className="border-b border-border bg-surface-alt/50 px-5 py-4 flex gap-5">
              {[40, 120, 180, 80, 100, 80].map((w, i) => (
                <div key={i} className="h-3 rounded bg-border/60 animate-pulse" style={{ width: w }} />
              ))}
            </div>
            {/* Skeleton rows */}
            {Array.from({ length: 5 }).map((_, row) => (
              <div key={row} className={`px-5 py-4 flex items-center gap-5 border-b border-border/50 ${row % 2 !== 0 ? 'bg-surface-alt/20' : ''}`}>
                <div className="h-3 w-8 rounded bg-border/40 animate-pulse" />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-border/40 animate-pulse" />
                  <div className="h-3 w-24 rounded bg-border/40 animate-pulse" />
                </div>
                <div className="h-3 w-40 rounded bg-border/40 animate-pulse" />
                <div className="h-6 w-16 rounded-lg bg-border/40 animate-pulse" />
                <div className="h-3 w-24 rounded bg-border/40 animate-pulse" />
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-lg bg-border/40 animate-pulse" />
                  <div className="w-8 h-8 rounded-lg bg-border/40 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <UserTable
            users={paginatedUsers}
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        )}
      </div>

      {/* Modals */}
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
      <EditUserModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedUser(null)
        }}
        user={selectedUser}
        onSuccess={handleEditSuccess}
      />
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedUser(null)
        }}
        user={selectedUser}
        onConfirm={handleDeleteConfirm}
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default App
