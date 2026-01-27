import { generatePassword } from './passwordGenerator.js'

const STORAGE_KEY = 'mySecurePasswords'
const LANG_KEY = 'securepass_lite.lang'

function applyEnvironmentMode() {
  const protocol = String(window.location.protocol || '')
  document.body.classList.remove('mode-web', 'mode-extension')
  if (protocol === 'http:' || protocol === 'https:' || protocol === 'file:') {
    document.body.classList.add('mode-web')
    return
  }
  if (protocol.startsWith('chrome-extension:') || protocol.startsWith('moz-extension:')) {
    document.body.classList.add('mode-extension')
  }
}

const I18N = {
  en: {
    meta: {
      title: 'SecurePass Lite — Offline Password Generator',
      description: 'Generate strong passwords, store locally in your browser, and share via QR code safely.',
    },
    header: {
      subtitle: 'Offline • Stored in this browser (localStorage)',
    },
    nav: {
      generate: 'Generate',
      book: 'Password Book',
      help: 'Help',
      settings: 'Settings',
    },
    generator: {
      title: 'Password Generator',
      hint: 'Use “Generate” for a cryptographically secure password.',
      outputLabel: 'Generated Password',
      outputPlaceholder: 'Click Generate',
      length: 'Length',
      optUpper: 'Uppercase (A-Z)',
      optLower: 'Lowercase (a-z)',
      optNumbers: 'Numbers (0-9)',
      optSymbols: 'Symbols (!@#$%^&*)',
      optExcludeAmbiguous: 'Exclude ambiguous characters (i, l, 1, L, o, 0, O)',
      errors: {
        lengthRange: 'Password length must be between 4 and 64',
        selectOne: 'Select at least one character set',
        tooShort: 'Length too short for selected options',
        emptyPool: 'Empty character pool',
        failed: 'Failed to generate',
      },
    },
    actions: {
      copy: 'Copy',
      generate: 'Generate',
    },
    qr: {
      title: 'QR Code',
      hint: 'Scan on mobile to transfer the password privately.',
      note: 'Treat QR like plain text. Avoid public display.',
      placeholder: 'Generate a password to render QR',
      libMissing: 'QR library not loaded',
    },
    save: {
      title: 'Save to Password Book',
      hint: 'Saves locally to this browser only.',
      siteLabel: 'Website / App Name *',
      usernameLabel: 'Username / Account ID (optional)',
      saveBtn: 'Save to Password Book',
      errors: {
        siteRequired: 'Website / App Name is required',
        noPassword: 'Generate a password first',
      },
    },
    book: {
      title: 'Password Book',
      storageHintPrefix: 'Stored in localStorage key:',
      searchLabel: 'Search',
      searchPlaceholder: 'Filter by site name',
      deleteAll: 'Delete All',
      emptyTitle: 'No saved passwords yet',
      emptyText: 'Generate a password and save it to your Password Book.',
      goToGenerator: 'Go to Generator',
      show: 'Show',
      hide: 'Hide',
      hiddenTitle: 'Hidden',
      copyPassword: 'Copy Password',
      delete: 'Delete',
      confirmDeleteEntry: 'Delete entry for “{site}”?',
      confirmDeleteAll: 'Delete ALL saved entries? This cannot be undone.',
    },
    table: {
      site: 'Website / App',
      username: 'Username',
      password: 'Password',
      created: 'Created',
      actions: 'Actions',
    },
    help: {
      title: 'Help & Security Notes',
      hint: 'SecurePass Lite is offline-first. No server is used.',
      storageTitle: 'Storage',
      storageText: 'Your data is stored in your current browser’s localStorage. Clearing site data or using private mode may remove it.',
      clipboardTitle: 'Clipboard',
      clipboardText: 'Copied passwords may be readable by other apps on your device. Clear your clipboard if needed.',
      qrTitle: 'QR Code Safety',
      qrText: 'A QR code is equivalent to showing the password in plaintext. Only use it in private.',
    },
    settings: {
      title: 'Settings',
      hint: 'Export or import your local password book.',
      backupTitle: 'Data Backup',
      backupDesc: 'Export downloads a file. Import overwrites your current data.',
      export: 'Export',
      import: 'Import',
      confirmImport: 'Import {count} entries and overwrite your current data?',
      errors: {
        invalidFile: 'Invalid backup file',
        fileTooLarge: 'File too large (max 2MB)',
      },
    },
    footer: {
      text: 'SecurePass Lite • No backend • Local only',
    },
    toast: {
      copied: 'Copied',
      copiedPassword: 'Copied password',
      saved: 'Saved to Password Book',
      deleted: 'Deleted',
      deletedAll: 'Deleted all',
      exported: 'Exported backup.json',
      imported: 'Imported',
      importedWithDrops: 'Imported (dropped {dropped} invalid entries)',
      copyFailed: 'Copy failed',
      nothingToCopy: 'Nothing to copy',
    },
  },
  zh: {
    meta: {
      title: 'SecurePass Lite — 离线密码生成器',
      description: '生成高强度密码，保存在浏览器本地，并通过二维码安全传输。',
    },
    header: {
      subtitle: '离线 • 数据仅保存在本浏览器（localStorage）',
    },
    nav: {
      generate: '生成',
      book: '密码本',
      help: '帮助',
      settings: '设置',
    },
    generator: {
      title: '密码生成器',
      hint: '点击“生成”可得到密码学安全的随机密码。',
      outputLabel: '生成的密码',
      outputPlaceholder: '点击生成',
      length: '长度',
      optUpper: '大写字母 (A-Z)',
      optLower: '小写字母 (a-z)',
      optNumbers: '数字 (0-9)',
      optSymbols: '符号 (!@#$%^&*)',
      optExcludeAmbiguous: '排除易混淆字符（i, l, 1, L, o, 0, O）',
      errors: {
        lengthRange: '密码长度必须在 4 到 64 之间',
        selectOne: '请至少选择一种字符类型',
        tooShort: '长度过短，无法满足所选类型的最小要求',
        emptyPool: '字符池为空',
        failed: '生成失败',
      },
    },
    actions: {
      copy: '复制',
      generate: '生成',
    },
    qr: {
      title: '二维码',
      hint: '用手机扫码可私密地传输密码。',
      note: '二维码等同于明文密码，请勿在公共场合展示。',
      placeholder: '生成密码后会显示二维码',
      libMissing: '二维码库未加载',
    },
    save: {
      title: '保存到密码本',
      hint: '仅保存到本浏览器，不会上传服务器。',
      siteLabel: '网站 / 应用名称 *',
      usernameLabel: '用户名 / 账号（可选）',
      saveBtn: '保存到密码本',
      errors: {
        siteRequired: '网站 / 应用名称为必填项',
        noPassword: '请先生成密码',
      },
    },
    book: {
      title: '密码本',
      storageHintPrefix: '存储在 localStorage 键：',
      searchLabel: '搜索',
      searchPlaceholder: '按网站/应用名称筛选',
      deleteAll: '全部删除',
      emptyTitle: '还没有保存任何记录',
      emptyText: '先生成一个密码，然后保存到密码本。',
      goToGenerator: '去生成器',
      show: '显示',
      hide: '隐藏',
      hiddenTitle: '已隐藏',
      copyPassword: '复制密码',
      delete: '删除',
      confirmDeleteEntry: '确定删除“{site}”的记录吗？',
      confirmDeleteAll: '确定删除全部已保存记录吗？此操作不可撤销。',
    },
    table: {
      site: '网站/应用',
      username: '用户名',
      password: '密码',
      created: '创建日期',
      actions: '操作',
    },
    help: {
      title: '帮助与安全说明',
      hint: 'SecurePass Lite 为离线工具，不会使用服务器。',
      storageTitle: '存储',
      storageText: '数据保存在当前浏览器的 localStorage。清除站点数据或使用无痕模式可能导致数据丢失。',
      clipboardTitle: '剪贴板',
      clipboardText: '复制到剪贴板的密码可能被其他应用读取。如有需要请及时清空剪贴板。',
      qrTitle: '二维码安全',
      qrText: '二维码等同于明文展示密码，请仅在私密场景使用。',
    },
    settings: {
      title: '设置',
      hint: '导出或导入你的本地密码本。',
      backupTitle: '数据备份',
      backupDesc: '导出会下载文件；导入会覆盖当前数据。',
      export: '导出',
      import: '导入',
      confirmImport: '确定导入 {count} 条记录并覆盖当前数据吗？',
      errors: {
        invalidFile: '备份文件无效',
        fileTooLarge: '文件过大（最大 2MB）',
      },
    },
    footer: {
      text: 'SecurePass Lite • 无后端 • 仅本地存储',
    },
    toast: {
      copied: '已复制',
      copiedPassword: '已复制密码',
      saved: '已保存到密码本',
      deleted: '已删除',
      deletedAll: '已全部删除',
      exported: '已导出 backup.json',
      imported: '已导入',
      importedWithDrops: '已导入（已丢弃 {dropped} 条无效记录）',
      copyFailed: '复制失败',
      nothingToCopy: '没有可复制的内容',
    },
  },
}

function getByPath(obj, path) {
  const parts = String(path || '').split('.')
  let cur = obj
  for (const p of parts) {
    if (!cur || typeof cur !== 'object') return undefined
    cur = cur[p]
  }
  return cur
}

function formatTemplate(str, vars) {
  let out = String(str)
  if (!vars) return out
  for (const [k, v] of Object.entries(vars)) {
    out = out.replaceAll(`{${k}}`, String(v))
  }
  return out
}

let currentLang = 'en'

function t(key, vars) {
  const table = I18N[currentLang] || I18N.en
  const raw = getByPath(table, key)
  if (typeof raw === 'string') return formatTemplate(raw, vars)
  return String(key)
}

function applyLanguage(lang) {
  currentLang = lang === 'zh' ? 'zh' : 'en'
  localStorage.setItem(LANG_KEY, currentLang)
  document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en'

  document.title = t('meta.title')
  const desc = document.querySelector('meta[name="description"]')
  if (desc) desc.setAttribute('content', t('meta.description'))

  for (const el of document.querySelectorAll('[data-i18n]')) {
    const key = el.dataset.i18n
    if (!key) continue
    el.textContent = t(key)
  }

  for (const el of document.querySelectorAll('[data-i18n-placeholder]')) {
    const key = el.dataset.i18nPlaceholder
    if (!key) continue
    el.setAttribute('placeholder', t(key))
  }

  if (typeof renderQr === 'function') {
    renderQr($('generatedPassword').value)
  }

  if (!document.querySelector('[data-panel="book"]').hidden) {
    renderBook()
  }
}

function detectDefaultLang() {
  const saved = localStorage.getItem(LANG_KEY)
  if (saved === 'en' || saved === 'zh') return saved
  const nav = (navigator.language || '').toLowerCase()
  if (nav.startsWith('zh')) return 'zh'
  return 'en'
}

function $(id) {
  const el = document.getElementById(id)
  if (!el) throw new Error(`Missing element: ${id}`)
  return el
}

function formatDateISO(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function toast(message) {
  const el = $('toast')
  el.textContent = message
  el.hidden = false
  clearTimeout(toast._t)
  toast._t = setTimeout(() => {
    el.hidden = true
  }, 1800)
}

async function copyToClipboard(text) {
  const value = String(text || '')
  if (!value) throw new Error(t('toast.nothingToCopy'))
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }

  const ta = document.createElement('textarea')
  ta.value = value
  ta.style.position = 'fixed'
  ta.style.left = '-9999px'
  ta.style.top = '0'
  document.body.appendChild(ta)
  ta.select()
  document.execCommand('copy')
  document.body.removeChild(ta)
}

function readEntries() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((e) => e && typeof e === 'object')
  } catch {
    return []
  }
}

function writeEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function normalizeImportedEntries(input) {
  const rawEntries = Array.isArray(input) ? input : input && Array.isArray(input.entries) ? input.entries : null
  if (!rawEntries) return { entries: [], dropped: 0 }

  const entries = []
  let dropped = 0
  for (const e of rawEntries) {
    if (!e || typeof e !== 'object') {
      dropped += 1
      continue
    }
    const site = typeof e.site === 'string' ? e.site.trim() : ''
    const password = typeof e.password === 'string' ? e.password : ''
    const username = typeof e.username === 'string' ? e.username : ''
    const createdAt = typeof e.createdAt === 'string' ? e.createdAt : ''
    if (!site || !password) {
      dropped += 1
      continue
    }

    const id = typeof e.id === 'string' && e.id ? e.id : `import_${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`
    entries.push({ id, site, username, password, createdAt })
  }

  return { entries, dropped }
}

function setError(el, message) {
  if (!message) {
    el.hidden = true
    el.textContent = ''
    return
  }
  el.textContent = message
  el.hidden = false
}

function clampLength(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return 16
  return Math.min(64, Math.max(4, Math.round(n)))
}

function getGeneratorState() {
  return {
    length: clampLength($('lengthNumber').value),
    useUpper: $('optUpper').checked,
    useLower: $('optLower').checked,
    useNumbers: $('optNumbers').checked,
    useSymbols: $('optSymbols').checked,
    excludeAmbiguous: $('optExcludeAmbiguous').checked,
  }
}

function renderQr(text) {
  const box = $('qrBox')
  box.innerHTML = ''

  const value = String(text || '')
  if (!value) {
    const placeholder = document.createElement('div')
    placeholder.className = 'mono'
    placeholder.style.color = 'rgba(155, 176, 209, 0.9)'
    placeholder.style.fontSize = '13px'
    placeholder.textContent = t('qr.placeholder')
    box.appendChild(placeholder)
    return
  }

  const QRCodeCtor = window.QRCode
  if (!QRCodeCtor) {
    const placeholder = document.createElement('div')
    placeholder.className = 'mono'
    placeholder.style.color = 'rgba(255, 222, 222, 0.98)'
    placeholder.style.fontSize = '13px'
    placeholder.textContent = t('qr.libMissing')
    box.appendChild(placeholder)
    return
  }

  new QRCodeCtor(box, {
    text: value,
    width: 220,
    height: 220,
    correctLevel: QRCodeCtor.CorrectLevel.M,
  })
}

function setActiveTab(tab) {
  for (const btn of document.querySelectorAll('.nav__tab')) {
    const isActive = btn.dataset.tab === tab
    if (isActive) btn.setAttribute('aria-current', 'page')
    else btn.removeAttribute('aria-current')
  }
  for (const panel of document.querySelectorAll('.panel')) {
    panel.hidden = panel.dataset.panel !== tab
  }
}

function normalizeEntry(e) {
  return {
    id: String(e.id || ''),
    site: String(e.site || ''),
    username: String(e.username || ''),
    password: String(e.password || ''),
    createdAt: String(e.createdAt || ''),
  }
}

const visibility = new Map()

function renderBook() {
  const tbody = $('bookTbody')
  const empty = $('emptyState')
  const q = String($('searchInput').value || '').trim().toLowerCase()

  const entries = readEntries().map(normalizeEntry)
  const filtered = q ? entries.filter((e) => e.site.toLowerCase().includes(q)) : entries

  tbody.innerHTML = ''

  if (!entries.length) {
    empty.hidden = false
  } else {
    empty.hidden = true
  }

  for (const entry of filtered) {
    const tr = document.createElement('tr')

    const tdSite = document.createElement('td')
    tdSite.textContent = entry.site
    tr.appendChild(tdSite)

    const tdUser = document.createElement('td')
    tdUser.textContent = entry.username || '—'
    tr.appendChild(tdUser)

    const tdPass = document.createElement('td')
    const isVisible = visibility.get(entry.id) === true
    const pill = document.createElement('div')
    pill.className = 'pill'

    const value = document.createElement('div')
    value.className = 'pill__value'
    value.title = isVisible ? entry.password : t('book.hiddenTitle')
    value.textContent = isVisible ? entry.password : '******'

    const toggle = document.createElement('button')
    toggle.type = 'button'
    toggle.className = 'btn btn--secondary btn--sm'
    toggle.textContent = isVisible ? t('book.hide') : t('book.show')
    toggle.addEventListener('click', () => {
      visibility.set(entry.id, !isVisible)
      renderBook()
    })

    pill.appendChild(value)
    pill.appendChild(toggle)
    tdPass.appendChild(pill)
    tr.appendChild(tdPass)

    const tdCreated = document.createElement('td')
    tdCreated.textContent = entry.createdAt || '—'
    tr.appendChild(tdCreated)

    const tdActions = document.createElement('td')
    const actions = document.createElement('div')
    actions.className = 'rowActions'

    const copyBtn = document.createElement('button')
    copyBtn.type = 'button'
    copyBtn.className = 'btn btn--secondary btn--sm'
    copyBtn.textContent = t('book.copyPassword')
    copyBtn.addEventListener('click', async () => {
      try {
        await copyToClipboard(entry.password)
        toast(t('toast.copiedPassword'))
      } catch (err) {
        toast(err instanceof Error ? err.message : t('toast.copyFailed'))
      }
    })

    const delBtn = document.createElement('button')
    delBtn.type = 'button'
    delBtn.className = 'btn btn--danger btn--sm'
    delBtn.textContent = t('book.delete')
    delBtn.addEventListener('click', () => {
      const ok = window.confirm(t('book.confirmDeleteEntry', { site: entry.site }))
      if (!ok) return
      const next = readEntries().filter((e) => String(e.id) !== entry.id)
      writeEntries(next)
      visibility.delete(entry.id)
      renderBook()
      toast(t('toast.deleted'))
    })

    actions.appendChild(copyBtn)
    actions.appendChild(delBtn)
    tdActions.appendChild(actions)
    tr.appendChild(tdActions)

    tbody.appendChild(tr)
  }
}

function handleGenerate() {
  const errEl = $('generatorError')
  setError(errEl, '')

  try {
    const state = getGeneratorState()
    const pwd = generatePassword(state)
    $('generatedPassword').value = pwd
    renderQr(pwd)
  } catch (err) {
    if (err instanceof Error) {
      const msg = String(err.message || '')
      const map = {
        'Password length must be between 4 and 64': t('generator.errors.lengthRange'),
        'Select at least one character set': t('generator.errors.selectOne'),
        'Length too short for selected options': t('generator.errors.tooShort'),
        'Empty character pool': t('generator.errors.emptyPool'),
      }
      setError(errEl, map[msg] || msg)
    } else {
      setError(errEl, t('generator.errors.failed'))
    }
  }
}

function bindLengthSync() {
  const range = $('lengthRange')
  const num = $('lengthNumber')
  const sync = (value) => {
    const v = String(clampLength(value))
    range.value = v
    num.value = v
  }

  range.addEventListener('input', () => sync(range.value))
  num.addEventListener('input', () => sync(num.value))
  sync(16)
}

function main() {
  applyEnvironmentMode()
  const defaultLang = detectDefaultLang()
  const langSelect = $('langSelect')
  langSelect.value = defaultLang
  langSelect.addEventListener('change', () => {
    applyLanguage(langSelect.value)
  })
  applyLanguage(defaultLang)

  bindLengthSync()

  for (const btn of document.querySelectorAll('.nav__tab')) {
    btn.addEventListener('click', () => {
      setActiveTab(btn.dataset.tab)
      if (btn.dataset.tab === 'book') renderBook()
    })
  }

  for (const btn of document.querySelectorAll('[data-switch-to]')) {
    btn.addEventListener('click', () => {
      setActiveTab(btn.dataset.switchTo)
    })
  }

  $('generateBtn').addEventListener('click', handleGenerate)

  $('copyGenerated').addEventListener('click', async () => {
    try {
      await copyToClipboard($('generatedPassword').value)
      toast(t('toast.copied'))
    } catch (err) {
      toast(err instanceof Error ? err.message : t('toast.copyFailed'))
    }
  })

  $('saveForm').addEventListener('submit', (e) => {
    e.preventDefault()
    const errEl = $('saveError')
    setError(errEl, '')

    const site = String($('siteInput').value || '').trim()
    const username = String($('usernameInput').value || '').trim()
    const password = String($('generatedPassword').value || '').trim()

    if (!site) {
      setError(errEl, t('save.errors.siteRequired'))
      return
    }
    if (!password) {
      setError(errEl, t('save.errors.noPassword'))
      return
    }

    const entry = {
      id: `timestamp_${Date.now()}`,
      site,
      username,
      password,
      createdAt: formatDateISO(new Date()),
    }

    const current = readEntries()
    writeEntries([entry, ...current])
    $('siteInput').value = ''
    $('usernameInput').value = ''
    toast(t('toast.saved'))
  })

  $('searchInput').addEventListener('input', () => renderBook())
  $('clearAllBtn').addEventListener('click', () => {
    const entries = readEntries()
    if (!entries.length) return
    const ok = window.confirm(t('book.confirmDeleteAll'))
    if (!ok) return
    writeEntries([])
    visibility.clear()
    renderBook()
    toast(t('toast.deletedAll'))
  })

  const importError = $('importError')
  const importFile = $('importFile')
  setError(importError, '')

  $('exportBtn').addEventListener('click', () => {
    setError(importError, '')
    const data = {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      entries: readEntries(),
    }
    downloadJson('backup.json', data)
    toast(t('toast.exported'))
  })

  $('importBtn').addEventListener('click', () => {
    setError(importError, '')
    importFile.value = ''
    importFile.click()
  })

  importFile.addEventListener('change', async () => {
    setError(importError, '')
    const file = importFile.files && importFile.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setError(importError, t('settings.errors.fileTooLarge'))
      return
    }

    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      const { entries, dropped } = normalizeImportedEntries(parsed)
      if (!entries.length) {
        setError(importError, t('settings.errors.invalidFile'))
        return
      }

      const ok = window.confirm(t('settings.confirmImport', { count: String(entries.length) }))
      if (!ok) return

      writeEntries(entries)
      visibility.clear()
      renderBook()
      toast(
        dropped > 0
          ? t('toast.importedWithDrops', { dropped: String(dropped) })
          : t('toast.imported')
      )
    } catch {
      setError(importError, t('settings.errors.invalidFile'))
    }
  })

  renderQr('')
  setActiveTab('generate')
}

main()
