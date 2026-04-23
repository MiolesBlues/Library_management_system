const loansElements = {
  status: document.getElementById('loansStatus'),
  timestamp: document.getElementById('loansTimestamp'),
  refreshButton: document.getElementById('refreshLoansButton'),
  form: document.getElementById('loanForm'),
  resetButton: document.getElementById('resetLoanButton'),
  issueButton: document.getElementById('issueLoanButton'),
  bookSelect: document.getElementById('loanBookId'),
  memberSelect: document.getElementById('loanMemberId'),
  loanDate: document.getElementById('loanDate'),
  dueDate: document.getElementById('dueDate'),
  loansTableBody: document.getElementById('loansTableBody'),
  overdueTableBody: document.getElementById('overdueTableBody'),
  counters: {
    active: document.getElementById('activeLoansCount'),
    overdue: document.getElementById('overdueLoansCount'),
    returned: document.getElementById('returnedLoansCount')
  }
};

let loansClient = null;
let booksLookup = [];
let membersLookup = [];
let loansData = [];

function hasLoansPage() {
  return Boolean(loansElements.form && loansElements.loansTableBody);
}

function setLoansStatus(message, type = 'info') {
  if (!loansElements.status) {
    return;
  }

  loansElements.status.textContent = message;
  loansElements.status.className = `dashboard-status ${type}`;
}

function setLoansTimestamp(message) {
  if (loansElements.timestamp) {
    loansElements.timestamp.textContent = message;
  }
}

function setLoansButtonState(isLoading) {
  if (loansElements.refreshButton) {
    loansElements.refreshButton.disabled = isLoading;
    loansElements.refreshButton.textContent = isLoading ? 'Loading...' : 'Refresh loans';
  }

  if (loansElements.issueButton) {
    loansElements.issueButton.disabled = isLoading;
    loansElements.issueButton.textContent = isLoading ? 'Saving...' : 'Issue loan';
  }
}

function getLoansClient() {
  if (loansClient) {
    return loansClient;
  }

  if (!window.librarySupabase || !window.librarySupabase.isSupabaseConfigured()) {
    return null;
  }

  loansClient = window.librarySupabase.createSupabaseClient();
  return loansClient;
}

function getLoansConfigMessage() {
  if (typeof window.supabase === 'undefined') {
    return 'The Supabase library did not load. Check your internet connection or CDN access.';
  }

  if (typeof window.APP_CONFIG === 'undefined') {
    return 'Supabase config is missing. Copy js/config.example.js to js/config.js and add your project values.';
  }

  return 'Supabase is not configured yet. Add your project URL and anon key in js/config.js.';
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatDate(dateValue) {
  if (!dateValue) {
    return '—';
  }

  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString();
}

function statusBadge(status) {
  return `<span class="status-badge ${status}">${escapeHtml(status)}</span>`;
}

function showLoansPlaceholder(message) {
  loansElements.loansTableBody.innerHTML = `<tr><td colspan="6">${message}</td></tr>`;
}

function showOverduePlaceholder(message) {
  loansElements.overdueTableBody.innerHTML = `<tr><td colspan="5">${message}</td></tr>`;
}

function resetLoanForm() {
  loansElements.form?.reset();
  const today = new Date();
  const due = new Date(today);
  due.setDate(due.getDate() + 14);
  loansElements.loanDate.value = today.toISOString().slice(0, 10);
  loansElements.dueDate.value = due.toISOString().slice(0, 10);
}

function populateBookOptions() {
  const options = ['<option value="">Choose a book</option>'];
  booksLookup
    .filter((book) => Number(book.available_copies) > 0)
    .sort((a, b) => a.title.localeCompare(b.title))
    .forEach((book) => {
      options.push(`<option value="${book.book_id}">${escapeHtml(book.title)} (${book.available_copies}/${book.total_copies} available)</option>`);
    });
  loansElements.bookSelect.innerHTML = options.join('');
}

function populateMemberOptions() {
  const options = ['<option value="">Choose a member</option>'];
  membersLookup
    .sort((a, b) => a.full_name.localeCompare(b.full_name))
    .forEach((member) => {
      options.push(`<option value="${member.member_id}">${escapeHtml(member.full_name)} (${escapeHtml(member.email)})</option>`);
    });
  loansElements.memberSelect.innerHTML = options.join('');
}

function updateLoanCounters() {
  const active = loansData.filter((loan) => loan.status === 'active').length;
  const overdue = loansData.filter((loan) => loan.status === 'overdue').length;
  const returned = loansData.filter((loan) => loan.status === 'returned').length;

  loansElements.counters.active.textContent = String(active);
  loansElements.counters.overdue.textContent = String(overdue);
  loansElements.counters.returned.textContent = String(returned);
}

function renderLoansTables() {
  updateLoanCounters();

  const currentLoans = loansData.filter((loan) => loan.status !== 'returned');
  const overdueLoans = loansData.filter((loan) => loan.status === 'overdue');

  if (!currentLoans.length) {
    showLoansPlaceholder('No active or overdue loans found.');
  } else {
    loansElements.loansTableBody.innerHTML = currentLoans
      .map((loan) => `
        <tr>
          <td><strong>${escapeHtml(loan.books?.title || 'Unknown book')}</strong></td>
          <td>${escapeHtml(loan.members?.full_name || 'Unknown member')}</td>
          <td>${escapeHtml(formatDate(loan.loan_date))}</td>
          <td>${escapeHtml(formatDate(loan.due_date))}</td>
          <td>${statusBadge(loan.status)}</td>
          <td>
            <div class="table-actions">
              <button class="button-secondary table-button" type="button" disabled>Return coming next</button>
            </div>
          </td>
        </tr>
      `)
      .join('');
  }

  if (!overdueLoans.length) {
    showOverduePlaceholder('No overdue loans found.');
  } else {
    loansElements.overdueTableBody.innerHTML = overdueLoans
      .map((loan) => `
        <tr>
          <td><strong>${escapeHtml(loan.books?.title || 'Unknown book')}</strong></td>
          <td>${escapeHtml(loan.members?.full_name || 'Unknown member')}</td>
          <td>${escapeHtml(formatDate(loan.due_date))}</td>
          <td>Needs overdue sync</td>
          <td>${statusBadge(loan.status)}</td>
        </tr>
      `)
      .join('');
  }
}

async function loadLoanDependencies(supabase) {
  const [booksResponse, membersResponse] = await Promise.all([
    supabase
      .from('books')
      .select('book_id, title, total_copies, available_copies')
      .order('title', { ascending: true }),
    supabase
      .from('members')
      .select('member_id, full_name, email')
      .order('full_name', { ascending: true })
  ]);

  if (booksResponse.error) {
    throw booksResponse.error;
  }

  if (membersResponse.error) {
    throw membersResponse.error;
  }

  booksLookup = booksResponse.data || [];
  membersLookup = membersResponse.data || [];
  populateBookOptions();
  populateMemberOptions();
}

async function loadLoans() {
  if (!hasLoansPage()) {
    return;
  }

  const supabase = getLoansClient();
  if (!supabase) {
    setLoansStatus(getLoansConfigMessage(), 'warning');
    setLoansTimestamp('Last updated: waiting for configuration.');
    showLoansPlaceholder('Connect Supabase to load loans.');
    showOverduePlaceholder('Connect Supabase to load overdue loans.');
    return;
  }

  setLoansButtonState(true);
  setLoansStatus('Loading books, members, and loans...', 'info');

  try {
    await loadLoanDependencies(supabase);

    const { data, error } = await supabase
      .from('loans')
      .select(`
        loan_id,
        book_id,
        member_id,
        loan_date,
        due_date,
        return_date,
        status,
        books (book_id, title),
        members (member_id, full_name)
      `)
      .order('due_date', { ascending: true });

    if (error) {
      throw error;
    }

    loansData = Array.isArray(data) ? data : [];
    renderLoansTables();
    setLoansStatus('Loans loaded successfully.', 'success');
    setLoansTimestamp(`Last updated: ${new Date().toLocaleString()}`);
  } catch (error) {
    console.error('Loans loading error:', error);
    booksLookup = [];
    membersLookup = [];
    loansData = [];
    populateBookOptions();
    populateMemberOptions();
    renderLoansTables();
    setLoansStatus('Could not load loans. Check the loans table, relationships, permissions, and configuration.', 'error');
    setLoansTimestamp('Last updated: load failed.');
  } finally {
    setLoansButtonState(false);
  }
}

function getLoanPayload() {
  const payload = {
    book_id: Number(loansElements.bookSelect.value),
    member_id: Number(loansElements.memberSelect.value),
    loan_date: loansElements.loanDate.value,
    due_date: loansElements.dueDate.value,
    status: 'active'
  };

  if (!payload.book_id || !payload.member_id) {
    throw new Error('Choose both a book and a member.');
  }

  if (!payload.loan_date || !payload.due_date) {
    throw new Error('Loan date and due date are required.');
  }

  if (payload.due_date <= payload.loan_date) {
    throw new Error('Due date must be later than loan date.');
  }

  const selectedBook = booksLookup.find((book) => Number(book.book_id) === payload.book_id);
  if (!selectedBook || Number(selectedBook.available_copies) < 1) {
    throw new Error('That book has no available copies right now.');
  }

  return payload;
}

async function issueLoan(event) {
  event.preventDefault();

  const supabase = getLoansClient();
  if (!supabase) {
    setLoansStatus(getLoansConfigMessage(), 'warning');
    return;
  }

  try {
    const payload = getLoanPayload();
    const selectedBook = booksLookup.find((book) => Number(book.book_id) === payload.book_id);

    setLoansButtonState(true);
    setLoansStatus('Issuing loan...', 'info');

    const insertResponse = await supabase
      .from('loans')
      .insert(payload)
      .select()
      .single();

    if (insertResponse.error) {
      throw insertResponse.error;
    }

    const updateResponse = await supabase
      .from('books')
      .update({ available_copies: Number(selectedBook.available_copies) - 1 })
      .eq('book_id', payload.book_id);

    if (updateResponse.error) {
      throw updateResponse.error;
    }

    resetLoanForm();
    setLoansStatus('Loan issued successfully.', 'success');
    await loadLoans();
  } catch (error) {
    console.error('Loan issue error:', error);
    setLoansStatus(error.message || 'Could not issue the loan.', 'error');
    setLoansTimestamp('Last updated: save failed.');
  } finally {
    setLoansButtonState(false);
  }
}

function initLoansPage() {
  if (!hasLoansPage()) {
    return;
  }

  resetLoanForm();
  showLoansPlaceholder('Loans will appear here after loading.');
  showOverduePlaceholder('Overdue loans will appear here after loading.');

  loansElements.form?.addEventListener('submit', issueLoan);
  loansElements.resetButton?.addEventListener('click', resetLoanForm);
  loansElements.refreshButton?.addEventListener('click', loadLoans);

  loadLoans();
}

initLoansPage();
