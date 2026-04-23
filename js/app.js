const contrastToggle = document.getElementById('contrastToggle');
const contrastStorageKey = 'libraryms-contrast-mode';

function setContrastMode(enabled) {
  document.body.classList.toggle('high-contrast', enabled);

  if (contrastToggle) {
    contrastToggle.setAttribute('aria-pressed', String(enabled));
    contrastToggle.textContent = enabled ? 'Standard Contrast' : 'High Contrast';
  }
}

const savedContrastMode = localStorage.getItem(contrastStorageKey) === 'true';
setContrastMode(savedContrastMode);

if (contrastToggle) {
  contrastToggle.addEventListener('click', () => {
    const isEnabled = !document.body.classList.contains('high-contrast');
    setContrastMode(isEnabled);
    localStorage.setItem(contrastStorageKey, String(isEnabled));
  });
}

function setDashboardValue(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = value;
  }
}

function setDashboardStatus(message, type = 'info') {
  const statusElement = document.getElementById('dashboardStatus');
  if (!statusElement) {
    return;
  }

  statusElement.textContent = message;
  statusElement.className = `dashboard-status ${type}`;
}

async function loadDashboardSummary() {
  const hasDashboard = document.getElementById('totalBooks');
  if (!hasDashboard) {
    return;
  }

  if (!window.librarySupabase || !window.librarySupabase.isSupabaseConfigured()) {
    setDashboardStatus('Supabase is not configured yet. Add your project URL and anon key in js/config.js.', 'warning');
    return;
  }

  const supabase = window.librarySupabase.createSupabaseClient();
  if (!supabase) {
    setDashboardStatus('Unable to create Supabase client. Check the configuration files.', 'error');
    return;
  }

  setDashboardStatus('Loading dashboard data from the database...', 'info');

  try {
    const [booksResult, membersResult, activeLoansResult, overdueLoansResult] = await Promise.all([
      supabase.from('books').select('*', { count: 'exact', head: true }),
      supabase.from('members').select('*', { count: 'exact', head: true }),
      supabase.from('loans').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('loans').select('*', { count: 'exact', head: true }).eq('status', 'overdue')
    ]);

    const results = [booksResult, membersResult, activeLoansResult, overdueLoansResult];
    const failedResult = results.find(result => result.error);

    if (failedResult) {
      throw failedResult.error;
    }

    setDashboardValue('totalBooks', booksResult.count ?? 0);
    setDashboardValue('totalMembers', membersResult.count ?? 0);
    setDashboardValue('activeLoans', activeLoansResult.count ?? 0);
    setDashboardValue('overdueBooks', overdueLoansResult.count ?? 0);

    setDashboardStatus('Dashboard connected successfully to Supabase.', 'success');
  } catch (error) {
    console.error('Dashboard loading error:', error);
    setDashboardStatus('Could not load dashboard data. Verify the table names, permissions, and configuration.', 'error');
  }
}

loadDashboardSummary();
