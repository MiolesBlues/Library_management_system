// books.js — Member 3: Books Page
// Handles all CRUD operations for the books table via Supabase

const SUPABASE_URL = 'https://gxwdcizgjehhztzhwnvf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4d2RjaXpnamVoaHp0emh3bnZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4ODg3MTgsImV4cCI6MjA5MjQ2NDcxOH0.LZshN13QMYCdH0xJUmnucTZf5WUhRQ1zHWft2lkUZ6A';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── DOM refs ──────────────────────────────────────────────────────────────────
const tableBody       = document.getElementById('booksTableBody');
const statusBanner    = document.getElementById('booksStatus');
const searchInput     = document.getElementById('searchInput');
const bookModal       = document.getElementById('bookModal');
const modalTitle      = document.getElementById('modalTitle');
const deleteModal     = document.getElementById('deleteModal');
const deleteMessage   = document.getElementById('deleteMessage');
const fieldTitle      = document.getElementById('fieldTitle');
const fieldAuthor     = document.getElementById('fieldAuthor');
const fieldGenre      = document.getElementById('fieldGenre');
const fieldYear       = document.getElementById('fieldYear');
const fieldISBN       = document.getElementById('fieldISBN');
const fieldTotal      = document.getElementById('fieldTotal');
const fieldAvailable  = document.getElementById('fieldAvailable');
const editBookId      = document.getElementById('editBookId');
const contrastToggle  = document.getElementById('contrastToggle');

// ── State ─────────────────────────────────────────────────────────────────────
let allBooks     = [];
let deleteTarget = null;

// ── High contrast (matches rest of site) ─────────────────────────────────────
if (localStorage.getItem('highContrast') === 'true') {
  document.body.classList.add('high-contrast');
  contrastToggle.setAttribute('aria-pressed', 'true');
}
contrastToggle.addEventListener('click', () => {
  const on = document.body.classList.toggle('high-contrast');
  contrastToggle.setAttribute('aria-pressed', String(on));
  localStorage.setItem('highContrast', on);
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function setStatus(msg, type = '') {
  statusBanner.textContent = msg;
  statusBanner.className = 'books-status' + (type ? ' ' + type : '');
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── Render table ──────────────────────────────────────────────────────────────
function renderTable(books) {
  if (!books.length) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--muted)">No books found.</td></tr>`;
    return;
  }
  tableBody.innerHTML = books.map(b => {
    const avail    = b.available_copies ?? 0;
    const badge    = avail === 0 ? 'copies-badge zero' : 'copies-badge';
    const availTxt = avail === 0 ? 'None' : `${avail} / ${b.total_copies ?? 0}`;
    return `
      <tr>
        <td>${escHtml(b.title)}</td>
        <td>${escHtml(b.author)}</td>
        <td>${escHtml(b.genre || '—')}</td>
        <td>${escHtml(b.published_year || '—')}</td>
        <td>${escHtml(b.isbn || '—')}</td>
        <td><span class="${badge}">${availTxt}</span></td>
        <td>
          <div class="row-actions">
            <button class="btn-edit"   data-id="${b.book_id}" type="button">Edit</button>
            <button class="btn-delete" data-id="${b.book_id}" data-title="${escHtml(b.title)}" type="button">Delete</button>
          </div>
        </td>
      </tr>`;
  }).join('');
}

// ── Load books from Supabase ──────────────────────────────────────────────────
async function loadBooks() {
  setStatus('Loading books…');
  try {
    const { data, error } = await supabaseClient
      .from('books').select('*').order('title', { ascending: true });
    if (error) throw error;
    allBooks = data || [];
    renderTable(allBooks);
    setStatus(`${allBooks.length} book${allBooks.length !== 1 ? 's' : ''} loaded.`, 'success');
  } catch (err) {
    setStatus('Could not load books. Check your Supabase configuration.', 'error');
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--muted)">Error loading data.</td></tr>`;
  }
}

// ── Search ────────────────────────────────────────────────────────────────────
searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  renderTable(q ? allBooks.filter(b =>
    (b.title || '').toLowerCase().includes(q) ||
    (b.author || '').toLowerCase().includes(q)
  ) : allBooks);
});

// ── Modal open / close ────────────────────────────────────────────────────────
function openModal(mode, book = null) {
  [fieldTitle, fieldAuthor, fieldGenre, fieldYear, fieldISBN, fieldTotal, fieldAvailable, editBookId]
    .forEach(el => el.value = '');
  if (mode === 'edit' && book) {
    modalTitle.textContent   = 'Edit Book';
    editBookId.value         = book.book_id;
    fieldTitle.value         = book.title            || '';
    fieldAuthor.value        = book.author           || '';
    fieldGenre.value         = book.genre            || '';
    fieldYear.value          = book.published_year   || '';
    fieldISBN.value          = book.isbn             || '';
    fieldTotal.value         = book.total_copies     ?? '';
    fieldAvailable.value     = book.available_copies ?? '';
  } else {
    modalTitle.textContent = 'Add Book';
  }
  bookModal.classList.add('open');
  fieldTitle.focus();
}

function closeModal()       { bookModal.classList.remove('open'); }
function closeDeleteModal() { deleteModal.classList.remove('open'); deleteTarget = null; }

document.getElementById('openAddModal').addEventListener('click', () => openModal('add'));
document.getElementById('closeModal').addEventListener('click', closeModal);
document.getElementById('cancelModal').addEventListener('click', closeModal);
bookModal.addEventListener('click', e => { if (e.target === bookModal) closeModal(); });

// ── Save (insert or update) ───────────────────────────────────────────────────
document.getElementById('saveBook').addEventListener('click', async () => {
  const title  = fieldTitle.value.trim();
  const author = fieldAuthor.value.trim();
  if (!title || !author) {
    setStatus('Title and Author are required.', 'warning');
    return;
  }
  const payload = {
    title, author,
    genre:            fieldGenre.value.trim()    || null,
    published_year:   fieldYear.value      ? parseInt(fieldYear.value)      : null,
    isbn:             fieldISBN.value.trim()      || null,
    total_copies:     fieldTotal.value     ? parseInt(fieldTotal.value)     : null,
    available_copies: fieldAvailable.value ? parseInt(fieldAvailable.value) : null,
  };
  try {
    const { error } = editBookId.value
      ? await supabaseClient.from('books').update(payload).eq('book_id', editBookId.value)
      : await supabaseClient.from('books').insert([payload]);
    if (error) throw error;
    closeModal();
    await loadBooks();
    setStatus(editBookId.value ? 'Book updated.' : 'Book added.', 'success');
  } catch (err) {
    setStatus('Could not save book. ' + (err.message || ''), 'error');
  }
});

// ── Delete ────────────────────────────────────────────────────────────────────
document.getElementById('closeDeleteModal').addEventListener('click', closeDeleteModal);
document.getElementById('cancelDelete').addEventListener('click', closeDeleteModal);
deleteModal.addEventListener('click', e => { if (e.target === deleteModal) closeDeleteModal(); });

document.getElementById('confirmDelete').addEventListener('click', async () => {
  if (!deleteTarget) return;
  try {
    const { error } = await supabaseClient.from('books').delete().eq('book_id', deleteTarget);
    if (error) throw error;
    closeDeleteModal();
    await loadBooks();
    setStatus('Book deleted.', 'success');
  } catch (err) {
    setStatus('Could not delete book. ' + (err.message || ''), 'error');
    closeDeleteModal();
  }
});

// ── Table button delegation ───────────────────────────────────────────────────
tableBody.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const id = btn.dataset.id;
  if (btn.classList.contains('btn-edit')) {
    const book = allBooks.find(b => String(b.book_id) === String(id));
    if (book) openModal('edit', book);
  }
  if (btn.classList.contains('btn-delete')) {
    deleteTarget = id;
    deleteMessage.textContent = `Are you sure you want to delete "${btn.dataset.title}"? This cannot be undone.`;
    deleteModal.classList.add('open');
  }
});

// ── Escape key closes modals ──────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); closeDeleteModal(); }
});

// ── Init ──────────────────────────────────────────────────────────────────────
loadBooks();
