import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import './style.css'

const app = document.querySelector('#app')

const tools = [
  { id: 'counter', name: 'عداد الكلمات', desc: 'احسب الكلمات والحروف والجمل في نصوصك.', icon: 'Aa', category: 'text', color: 'purple', tag: 'TEXT' },
  { id: 'cleaner', name: 'منظف النصوص', desc: 'تخلص من المسافات والأسطر الزائدة.', icon: '⌫', category: 'text', color: 'blue', tag: 'TEXT' },
  { id: 'compress', name: 'ضاغط الصور', desc: 'قلل حجم صورك مع الحفاظ على جودتها.', icon: '▧', category: 'image', color: 'pink', tag: 'IMAGE' },
  { id: 'resize', name: 'تغيير حجم الصور', desc: 'غيّر أبعاد الصور بسهولة.', icon: '⛶', category: 'image', color: 'orange', tag: 'IMAGE' },
  { id: 'json', name: 'منسق JSON', desc: 'رتب وتحقق من ملفات JSON.', icon: '{ }', category: 'developer', color: 'green', tag: 'DEV' },
  { id: 'calculator', name: 'حاسبة متقدمة', desc: 'نفّذ العمليات الحسابية بسرعة.', icon: '＋', category: 'calculator', color: 'yellow', tag: 'MATH' },
  { id: 'media', name: 'محول الوسائط', desc: 'حوّل الفيديوهات والصوتيات بين أشهر الصيغ.', icon: '▶', category: 'media', color: 'purple', tag: 'MEDIA' }
]

app.innerHTML = `
  <header class="navbar">
    <a class="logo" href="#">
      <span class="logo-icon">✦</span>
      TOOLBOX<span class="dot">.</span>
    </a>
    <nav>
      <a href="#tools">الأدوات</a>
      <a href="#about">عن المنصة</a>
    </nav>
    <button class="theme-btn" id="themeBtn">☀</button>
  </header>

  <main>
    <section class="hero">
      <div class="hero-tag">✦ عالمك الرقمي في مكان واحد</div>
      <h1>
        كل الأدوات التي تحتاجها،
        <br><span>في مكان واحد.</span>
      </h1>
      <p>مجموعة من الأدوات الذكية والبسيطة لإنجاز أعمالك اليومية بسهولة وسرعة.</p>

      <div class="search-box">
        <span>⌕</span>
        <input id="search" placeholder="ابحث عن أداة..." />
        <kbd>SEARCH</kbd>
      </div>

      <div class="stats">
        <div><strong>7+</strong><small>أدوات رقمية</small></div>
        <div><strong>100%</strong><small>سهولة الاستخدام</small></div>
        <div><strong>24/7</strong><small>متاحة دائماً</small></div>
      </div>
    </section>

    <section class="tools-section" id="tools">
      <div class="section-heading">
        <div>
          <span class="eyebrow">EXPLORE TOOLBOX</span>
          <h2>استكشف الأدوات</h2>
        </div>
        <span class="tool-count" id="count">7 أدوات</span>
      </div>

      <div class="categories">
        <button class="category active" data-category="all">الكل</button>
        <button class="category" data-category="text">النصوص</button>
        <button class="category" data-category="image">الصور</button>
        <button class="category" data-category="developer">المطورين</button>
        <button class="category" data-category="calculator">الحسابات</button>
        <button class="category" data-category="media">الوسائط</button>
      </div>

      <div class="tools-grid" id="toolsGrid"></div>
      <div class="empty" id="empty" hidden>لم نجد أي أدوات مطابقة 🔍</div>
    </section>

    <section class="about" id="about">
      <span class="eyebrow">ABOUT TOOLBOX</span>
      <h2>البساطة تلتقي بالإنتاجية.</h2>
      <p>منصة واحدة، أدوات متعددة، ووقت أقل لإنجاز مهامك.</p>
    </section>
  </main>

  <footer>
    <div class="logo">TOOLBOX<span class="dot">.</span></div>
    <p>من ابداعات بالعربي | المطور ميدو 🪶</p>
    <small>© 2026 TOOLBOX. جميع الحقوق محفوظة.</small>
  </footer>

  <div class="modal" id="toolModal" hidden>
    <div class="modal-content" id="modalContent">
      <button class="close-modal" id="closeModal">×</button>
      <div id="toolBody"></div>
    </div>
  </div>
`

const grid = document.querySelector('#toolsGrid')
const search = document.querySelector('#search')
const count = document.querySelector('#count')
const empty = document.querySelector('#empty')
const modal = document.querySelector('#toolModal')
const toolBody = document.querySelector('#toolBody')

let activeCategory = 'all'

function renderTools() {
  const query = search.value.trim().toLowerCase()

  const filtered = tools.filter(tool =>
    (activeCategory === 'all' || tool.category === activeCategory) &&
    (tool.name.toLowerCase().includes(query) ||
     tool.desc.toLowerCase().includes(query))
  )

  grid.innerHTML = filtered.map((tool, index) => `
    <article class="tool-card" style="animation-delay:${index * 60}ms">
      <div class="card-top">
        <div class="tool-icon ${tool.color}">${tool.icon}</div>
        <span class="tool-tag">${tool.tag}</span>
      </div>
      <h3>${tool.name}</h3>
      <p>${tool.desc}</p>
      <button class="open-tool" data-tool="${tool.id}">
        فتح الأداة <span>←</span>
      </button>
    </article>
  `).join('')

  count.textContent = `${filtered.length} أدوات`
  empty.hidden = filtered.length !== 0
}

search.addEventListener('input', renderTools)

document.querySelectorAll('.category').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('.category.active')?.classList.remove('active')
    button.classList.add('active')
    activeCategory = button.dataset.category
    renderTools()
  })
})

document.querySelector('#themeBtn').addEventListener('click', () => {
  document.body.classList.toggle('light')
})

function openModal(title, description, content) {
  toolBody.innerHTML = `
    <h2>${title}</h2>
    <p>${description}</p>
    ${content}
  `
  modal.hidden = false
}

function closeModal() {
  modal.hidden = true
}

document.querySelector('#closeModal').addEventListener('click', closeModal)

modal.addEventListener('click', event => {
  if (event.target === modal) closeModal()
})

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeModal()
})

grid.addEventListener('click', event => {
  const button = event.target.closest('[data-tool]')
  if (!button) return
  openTool(button.dataset.tool)
})

// ================= MEDIA CONVERTER =================

let ffmpegInstance = null
let ffmpegLoading = false
let mediaOutputUrl = null

async function getFFmpeg(statusElement, loadButton) {
  if (ffmpegInstance) return ffmpegInstance
  if (ffmpegLoading) throw new Error('المحرك قيد التحميل، انتظر قليلاً.')

  ffmpegLoading = true
  loadButton.disabled = true
  statusElement.textContent = 'جاري تحميل محرك التحويل لأول مرة... قد يستغرق ذلك بعض الوقت.'

  try {
    const ffmpeg = new FFmpeg()
    const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm'

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
    })

    ffmpegInstance = ffmpeg
    return ffmpeg
  } finally {
    ffmpegLoading = false
    loadButton.disabled = false
  }
}

function openTool(id) {
  const tool = tools.find(item => item.id === id)
  if (!tool) return

  if (id === 'counter') {
    openModal(tool.name, tool.desc, `
      <textarea id="counterText" rows="7" placeholder="اكتب أو الصق النص هنا..."></textarea>
      <div class="stats tool-stats">
        <div><strong id="wordCount">0</strong><small>كلمة</small></div>
        <div><strong id="charCount">0</strong><small>حرف</small></div>
        <div><strong id="sentenceCount">0</strong><small>جملة</small></div>
      </div>
      <p id="charNoSpace">الحروف بدون مسافات: 0</p>
    `)

    const input = document.querySelector('#counterText')
    input.addEventListener('input', () => {
      const text = input.value
      const words = text.trim() ? text.trim().split(/\s+/).length : 0
      const sentences = text.trim()
        ? text.split(/[.!؟?。\n]+/).filter(s => s.trim()).length
        : 0

      document.querySelector('#wordCount').textContent = words
      document.querySelector('#charCount').textContent = text.length
      document.querySelector('#sentenceCount').textContent = sentences
      document.querySelector('#charNoSpace').textContent =
        `الحروف بدون مسافات: ${text.replace(/\s/g, '').length}`
    })
  }

  if (id === 'cleaner') {
    openModal(tool.name, tool.desc, `
      <textarea id="cleanInput" rows="7" placeholder="الصق النص هنا..."></textarea>
      <button class="tool-action" id="cleanBtn">تنظيف النص</button>
      <textarea id="cleanOutput" rows="7" placeholder="النص بعد التنظيف..." readonly></textarea>
      <button class="tool-action" id="copyClean">نسخ النتيجة</button>
      <p id="cleanStatus"></p>
    `)

    document.querySelector('#cleanBtn').addEventListener('click', () => {
      const value = document.querySelector('#cleanInput').value
      const result = value
        .split('\n')
        .map(line => line.replace(/[ \t]+/g, ' ').trim())
        .filter(Boolean)
        .join('\n')

      document.querySelector('#cleanOutput').value = result
      document.querySelector('#cleanStatus').textContent = 'تم تنظيف النص بنجاح.'
    })

    document.querySelector('#copyClean').addEventListener('click', async () => {
      await navigator.clipboard.writeText(document.querySelector('#cleanOutput').value)
      document.querySelector('#cleanStatus').textContent = 'تم نسخ النص.'
    })
  }

  if (id === 'json') {
    openModal(tool.name, tool.desc, `
      <textarea id="jsonInput" rows="8" placeholder='الصق JSON هنا...'></textarea>
      <button class="tool-action" id="formatJson">تنسيق JSON</button>
      <button class="tool-action" id="minifyJson">ضغط JSON</button>
      <textarea id="jsonOutput" rows="8" placeholder="النتيجة..." readonly></textarea>
      <p id="jsonStatus"></p>
    `)

    function processJSON(compact) {
      try {
        const value = JSON.parse(document.querySelector('#jsonInput').value)
        document.querySelector('#jsonOutput').value =
          JSON.stringify(value, null, compact ? 0 : 2)
        document.querySelector('#jsonStatus').textContent = 'JSON صحيح ✓'
      } catch (error) {
        document.querySelector('#jsonStatus').textContent =
          'خطأ في JSON: ' + error.message
      }
    }

    document.querySelector('#formatJson').addEventListener('click', () => processJSON(false))
    document.querySelector('#minifyJson').addEventListener('click', () => processJSON(true))
  }

  if (id === 'calculator') {
    openModal(tool.name, 'حاسبة للعمليات الحسابية الأساسية.', `
      <input id="calcInput" type="text" placeholder="مثال: 25 × 4 + 10" />
      <div class="calc-buttons">
        ${['7','8','9','/','4','5','6','*','1','2','3','-','0','.','(',')','C','+','⌫','='].map(key =>
          `<button class="tool-action calc-key" data-key="${key}">${key}</button>`
        ).join('')}
      </div>
      <p id="calcResult">النتيجة ستظهر هنا.</p>
    `)

    const input = document.querySelector('#calcInput')
    const result = document.querySelector('#calcResult')

    document.querySelectorAll('.calc-key').forEach(button => {
      button.addEventListener('click', () => {
        const key = button.dataset.key

        if (key === 'C') input.value = ''
        else if (key === '⌫') input.value = input.value.slice(0, -1)
        else if (key === '=') {
          try {
            result.textContent = 'النتيجة: ' + calculate(input.value)
          } catch {
            result.textContent = 'عملية حسابية غير صحيحة.'
          }
        } else {
          input.value += key
        }
      })
    })
  }

  if (id === 'compress') {
    openModal(tool.name, tool.desc, `
      <label>اختر صورة</label>
      <input id="imageFile" type="file" accept="image/*" />
      <label>جودة الصورة: <span id="qualityValue">75%</span></label>
      <input id="quality" type="range" min="10" max="100" value="75" />
      <button class="tool-action" id="compressBtn">ضغط الصورة</button>
      <p id="imageStatus"></p>
      <a id="imageDownload" class="action-btn" hidden download="toolbox-compressed.jpg">تحميل الصورة</a>
    `)

    document.querySelector('#quality').addEventListener('input', event => {
      document.querySelector('#qualityValue').textContent = event.target.value + '%'
    })

    document.querySelector('#compressBtn').addEventListener('click', async () => {
      const file = document.querySelector('#imageFile').files[0]
      if (!file) return setImageStatus('اختر صورة أولاً.')

      try {
        const image = await loadImage(file)
        const canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        canvas.getContext('2d').drawImage(image, 0, 0)

        canvas.toBlob(blob => {
          if (!blob) return setImageStatus('تعذر ضغط الصورة.')

          setDownload(blob, 'toolbox-compressed.jpg')
          setImageStatus(
            `الحجم الأصلي: ${formatBytes(file.size)} | بعد الضغط: ${formatBytes(blob.size)}`
          )
        }, 'image/jpeg', Number(document.querySelector('#quality').value) / 100)
      } catch {
        setImageStatus('تعذر فتح الصورة.')
      }
    })
  }

  if (id === 'resize') {
    openModal(tool.name, tool.desc, `
      <label>اختر صورة</label>
      <input id="resizeFile" type="file" accept="image/*" />
      <label>العرض بالبكسل</label>
      <input id="resizeWidth" type="number" min="1" placeholder="العرض" />
      <label>الارتفاع بالبكسل</label>
      <input id="resizeHeight" type="number" min="1" placeholder="الارتفاع" />
      <label><input type="checkbox" id="keepRatio" checked /> المحافظة على التناسب</label>
      <button class="tool-action" id="resizeBtn">تغيير الحجم</button>
      <p id="resizeStatus"></p>
      <a id="resizeDownload" class="action-btn" hidden download="toolbox-resized.png">تحميل الصورة</a>
    `)

    let originalImage = null
    const fileInput = document.querySelector('#resizeFile')

    fileInput.addEventListener('change', async () => {
      const file = fileInput.files[0]
      if (!file) return

      try {
        originalImage = await loadImage(file)
        document.querySelector('#resizeWidth').value = originalImage.width
        document.querySelector('#resizeHeight').value = originalImage.height
      } catch {
        document.querySelector('#resizeStatus').textContent = 'تعذر فتح الصورة.'
      }
    })

    document.querySelector('#resizeWidth').addEventListener('input', () => {
      if (!originalImage || !document.querySelector('#keepRatio').checked) return
      const width = Number(document.querySelector('#resizeWidth').value)
      document.querySelector('#resizeHeight').value =
        Math.round(width * originalImage.height / originalImage.width)
    })

    document.querySelector('#resizeHeight').addEventListener('input', () => {
      if (!originalImage || !document.querySelector('#keepRatio').checked) return
      const height = Number(document.querySelector('#resizeHeight').value)
      document.querySelector('#resizeWidth').value =
        Math.round(height * originalImage.width / originalImage.height)
    })

    document.querySelector('#resizeBtn').addEventListener('click', () => {
      if (!originalImage) {
        document.querySelector('#resizeStatus').textContent = 'اختر صورة أولاً.'
        return
      }

      const width = Number(document.querySelector('#resizeWidth').value)
      const height = Number(document.querySelector('#resizeHeight').value)

      if (!Number.isInteger(width) || !Number.isInteger(height) ||
          width < 1 || height < 1 || width > 10000 || height > 10000) {
        document.querySelector('#resizeStatus').textContent = 'أدخل أبعاداً صحيحة.'
        return
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(originalImage, 0, 0, width, height)

      canvas.toBlob(blob => {
        if (!blob) {
          document.querySelector('#resizeStatus').textContent = 'تعذر تغيير الحجم.'
          return
        }

        const link = document.querySelector('#resizeDownload')
        if (link.dataset.url) URL.revokeObjectURL(link.dataset.url)
        const url = URL.createObjectURL(blob)
        link.href = url
        link.dataset.url = url
        link.hidden = false
        document.querySelector('#resizeStatus').textContent = 'تم تغيير حجم الصورة بنجاح.'
      }, 'image/png')
    })
  }

  if (id === 'media') {
    openModal(tool.name, tool.desc, `
      <div class="media-tool">
        <div class="media-drop">
          <div class="media-symbol">⇧</div>
          <strong>اختر ملف فيديو أو صوت</strong>
          <small>MP4, WEBM, MOV, MKV, MP3, WAV, M4A, OGG وغيرها</small>
          <input id="mediaFile" type="file" accept="video/*,audio/*,.mkv,.avi,.flac,.aac,.opus,.wma" />
        </div>

        <div class="media-file-info" id="mediaFileInfo">لم يتم اختيار ملف بعد.</div>

        <label for="mediaFormat">صيغة الملف الناتج</label>
        <select id="mediaFormat">
          <option value="mp4">MP4 - فيديو</option>
          <option value="webm">WEBM - فيديو</option>
          <option value="mp3">MP3 - صوت</option>
          <option value="wav">WAV - صوت غير مضغوط</option>
          <option value="m4a">M4A - صوت</option>
          <option value="ogg">OGG - صوت</option>
        </select>

        <label for="mediaQuality">جودة التحويل</label>
        <select id="mediaQuality">
          <option value="high">عالية</option>
          <option value="medium" selected>متوسطة ومتوازنة</option>
          <option value="small">حجم أصغر</option>
        </select>

        <button class="tool-action" id="mediaLoadBtn">تحميل محرك التحويل</button>
        <button class="tool-action media-convert-btn" id="mediaConvertBtn" disabled>ابدأ التحويل</button>

        <div class="media-progress" id="mediaProgressWrap" hidden>
          <div class="media-progress-track"><span id="mediaProgressBar"></span></div>
          <small id="mediaProgressText">0%</small>
        </div>

        <p class="media-status" id="mediaStatus">ملفاتك تتم معالجتها داخل المتصفح ولا يتم رفعها إلى خادم.</p>
        <a id="mediaDownload" class="action-btn" hidden>تحميل الملف الناتج</a>
      </div>
    `)

    const fileInput = document.querySelector('#mediaFile')
    const formatInput = document.querySelector('#mediaFormat')
    const qualityInput = document.querySelector('#mediaQuality')
    const loadButton = document.querySelector('#mediaLoadBtn')
    const convertButton = document.querySelector('#mediaConvertBtn')
    const status = document.querySelector('#mediaStatus')
    const fileInfo = document.querySelector('#mediaFileInfo')
    const progressWrap = document.querySelector('#mediaProgressWrap')
    const progressBar = document.querySelector('#mediaProgressBar')
    const progressText = document.querySelector('#mediaProgressText')
    const download = document.querySelector('#mediaDownload')

    let selectedFile = null
    let isConverting = false

    fileInput.addEventListener('change', () => {
      selectedFile = fileInput.files[0] || null
      download.hidden = true
      if (mediaOutputUrl) {
        URL.revokeObjectURL(mediaOutputUrl)
        mediaOutputUrl = null
      }

      if (!selectedFile) {
        fileInfo.textContent = 'لم يتم اختيار ملف بعد.'
        convertButton.disabled = true
        return
      }

      fileInfo.textContent = `${selectedFile.name} • ${formatBytes(selectedFile.size)}`
      convertButton.disabled = !ffmpegInstance
      if (selectedFile.size > 300 * 1024 * 1024) {
        status.textContent = 'تنبيه: الملف كبير وقد يحتاج ذاكرة ووقتاً أطول للتحويل.'
      } else {
        status.textContent = 'تم اختيار الملف. اختر الصيغة ثم ابدأ التحويل.'
      }
    })

    loadButton.addEventListener('click', async () => {
      try {
        await getFFmpeg(status, loadButton)
        status.textContent = 'محرك التحويل جاهز ✓ اختر ملفاً وابدأ التحويل.'
        convertButton.disabled = !selectedFile
      } catch (error) {
        console.error(error)
        status.textContent = 'تعذر تحميل المحرك. تحقق من اتصال الإنترنت ثم حاول مجدداً. ' + error.message
      }
    })

    convertButton.addEventListener('click', async () => {
      if (!selectedFile || !ffmpegInstance || isConverting) return

      isConverting = true
      convertButton.disabled = true
      loadButton.disabled = true
      download.hidden = true
      progressWrap.hidden = false
      progressBar.style.width = '0%'
      progressText.textContent = 'جاري تجهيز الملف...'
      status.textContent = 'بدأ التحويل، لا تغلق الصفحة.'

      let inputName = ''
      let outputName = ''

      const updateProgress = ({ progress }) => {
        const percent = Math.max(0, Math.min(100, Math.round(progress * 100)))
        progressBar.style.width = `${percent}%`
        progressText.textContent = `${percent}%`
      }

      try {
        const ffmpeg = ffmpegInstance
        ffmpeg.on('progress', updateProgress)

        const originalExtension = selectedFile.name.includes('.')
          ? selectedFile.name.split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '')
          : 'bin'

        inputName = `toolbox_input.${originalExtension || 'bin'}`
        const outputFormat = formatInput.value
        outputName = `toolbox_converted.${outputFormat}`

        await ffmpeg.writeFile(inputName, await fetchFile(selectedFile))

        const quality = qualityInput.value
        const args = ['-i', inputName]

        if (['mp3', 'wav', 'm4a', 'ogg'].includes(outputFormat)) {
          args.push('-vn')
          if (outputFormat === 'mp3') {
            args.push('-c:a', 'libmp3lame', '-b:a', quality === 'high' ? '320k' : quality === 'small' ? '96k' : '192k')
          } else if (outputFormat === 'wav') {
            args.push('-c:a', 'pcm_s16le')
          } else if (outputFormat === 'm4a') {
            args.push('-c:a', 'aac', '-b:a', quality === 'high' ? '256k' : quality === 'small' ? '96k' : '160k')
          } else {
            args.push('-c:a', 'libvorbis', '-q:a', quality === 'high' ? '6' : quality === 'small' ? '2' : '4')
          }
        } else if (outputFormat === 'mp4') {
          args.push(
            '-c:v', 'libx264',
            '-preset', 'ultrafast',
            '-crf', quality === 'high' ? '20' : quality === 'small' ? '30' : '25',
            '-c:a', 'aac',
            '-b:a', quality === 'high' ? '192k' : quality === 'small' ? '96k' : '128k',
            '-pix_fmt', 'yuv420p',
            '-movflags', '+faststart'
          )
        } else if (outputFormat === 'webm') {
          args.push(
            '-c:v', 'libvpx',
            '-deadline', 'realtime',
            '-cpu-used', '5',
            '-b:v', quality === 'high' ? '2M' : quality === 'small' ? '500k' : '1M',
            '-c:a', 'libopus',
            '-b:a', quality === 'high' ? '160k' : quality === 'small' ? '64k' : '96k'
          )
        }

        args.push(outputName)
        const exitCode = await ffmpeg.exec(args)
        if (exitCode !== 0) throw new Error('فشل التحويل. قد تكون الصيغة أو الترميزات غير مدعومة لهذا الملف.')

        const data = await ffmpeg.readFile(outputName)
        const mimeTypes = {
          mp4: 'video/mp4',
          webm: 'video/webm',
          mp3: 'audio/mpeg',
          wav: 'audio/wav',
          m4a: 'audio/mp4',
          ogg: 'audio/ogg'
        }

        const blob = new Blob([data], { type: mimeTypes[outputFormat] })
        if (mediaOutputUrl) URL.revokeObjectURL(mediaOutputUrl)
        mediaOutputUrl = URL.createObjectURL(blob)

        download.href = mediaOutputUrl
        download.download = `${selectedFile.name.replace(/\.[^.]+$/, '')}.${outputFormat}`
        download.textContent = `تحميل الملف (${formatBytes(blob.size)})`
        download.hidden = false

        progressBar.style.width = '100%'
        progressText.textContent = '100%'
        status.textContent = 'اكتمل التحويل بنجاح ✓'
      } catch (error) {
        console.error('Media conversion error:', error)
        status.textContent = 'حصل خطأ أثناء التحويل: ' + error.message
      } finally {
        ffmpegInstance?.off('progress', updateProgress)
        if (inputName) {
          try { await ffmpegInstance.deleteFile(inputName) } catch {}
        }
        if (outputName) {
          try { await ffmpegInstance.deleteFile(outputName) } catch {}
        }
        isConverting = false
        convertButton.disabled = !selectedFile || !ffmpegInstance
        loadButton.disabled = false
      }
    })
  }
}

function calculate(expression) {
  const tokens = expression.match(/\d*\.?\d+|[()+\-*/]/g) || []
  if (tokens.join('') !== expression.replace(/\s/g, '') || !tokens.length) {
    throw new Error('Invalid expression')
  }

  let position = 0

  function factor() {
    const token = tokens[position++]
    if (token === '+') return factor()
    if (token === '-') return -factor()
    if (token === '(') {
      const value = expressionPart()
      if (tokens[position++] !== ')') throw new Error('Missing )')
      return value
    }
    const number = Number(token)
    if (!Number.isFinite(number)) throw new Error('Invalid number')
    return number
  }

  function term() {
    let value = factor()
    while (tokens[position] === '*' || tokens[position] === '/') {
      const operator = tokens[position++]
      const next = factor()
      if (operator === '/' && next === 0) throw new Error('Division by zero')
      value = operator === '*' ? value * next : value / next
    }
    return value
  }

  function expressionPart() {
    let value = term()
    while (tokens[position] === '+' || tokens[position] === '-') {
      const operator = tokens[position++]
      const next = term()
      value = operator === '+' ? value + next : value - next
    }
    return value
  }

  const answer = expressionPart()
  if (position !== tokens.length || !Number.isFinite(answer)) {
    throw new Error('Invalid expression')
  }
  return answer
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Image loading failed'))
    }
    image.src = url
  })
}

function setImageStatus(message) {
  document.querySelector('#imageStatus').textContent = message
}

function setDownload(blob, filename) {
  const link = document.querySelector('#imageDownload')
  if (link.dataset.url) URL.revokeObjectURL(link.dataset.url)
  const url = URL.createObjectURL(blob)
  link.href = url
  link.download = filename
  link.dataset.url = url
  link.hidden = false
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

renderTools()

// ================= MINI MIDO AI =================

const miniMidoDefaults = {
  name: 'ميني ميدو',
  personality: 'ذكي، مرح، هادئ، وسريع البديهة.',
  language: 'العربية السودانية',
  style: 'مختصر ومباشر',
  rules: 'لا تشتم، لا تتنمر، لا تخترع المعلومات، واعترف عندما لا تعرف الإجابة.',
  extra: ''
}

let miniMidoSettings = {
  ...miniMidoDefaults,
  ...JSON.parse(localStorage.getItem('miniMidoSettings') || '{}')
}

document.body.insertAdjacentHTML('beforeend', `
  <button id="miniMidoLauncher" class="mini-mido-launcher">
    <span>✦</span>
    <span id="miniMidoLauncherName">ميني ميدو</span>
  </button>

  <section class="mini-mido-panel" id="miniMidoPanel" hidden>
    <header class="mini-mido-header">
      <div>
        <strong id="miniMidoTitle">ميني ميدو 🪶</strong>
        <small>مساعد TOOLBOX الذكي</small>
      </div>
      <div class="mini-mido-head-actions">
        <button id="miniMidoSettingsBtn" title="الإعدادات">⚙</button>
        <button id="miniMidoClose" title="إغلاق">×</button>
      </div>
    </header>

    <div class="mini-mido-chat" id="miniMidoChat">
      <div class="mini-mido-message bot">
        أهلاً! أنا <strong id="miniMidoWelcomeName">ميني ميدو</strong> 🪶
        <br>مساعدك الذكي في TOOLBOX.
      </div>
    </div>

    <form id="miniMidoForm" class="mini-mido-input-area">
      <input id="miniMidoInput" placeholder="اكتب رسالتك..." autocomplete="off">
      <button type="submit">➤</button>
    </form>

    <div class="mini-mido-settings" id="miniMidoSettings" hidden>
      <h3>⚙ إعدادات المساعد</h3>

      <div class="mm-creator-card">
        <strong>هوية المشروع</strong>
        <span>المطوّر: ميدو</span>
        <span>الاستوديو: بالعربي 🪶</span>
        <span>المنصّة: TOOLBOX</span>
      </div>

      <label>اسم المساعد</label>
      <input id="mmName">

      <label>الشخصية</label>
      <textarea id="mmPersonality"></textarea>

      <label>اللهجة واللغة</label>
      <input id="mmLanguage">

      <label>أسلوب الرد</label>
      <input id="mmStyle">

      <label>حدود الكلام والتعليمات</label>
      <textarea id="mmRules"></textarea>

      <label>تعليمات إضافية</label>
      <textarea id="mmExtra" placeholder="أي تفاصيل أخرى..."></textarea>

      <button id="mmSave" type="button">حفظ الشخصية</button>
      <button id="mmReset" type="button" class="mm-reset">استعادة الافتراضي</button>
    </div>
  </section>
`)

const mmPanel = document.querySelector('#miniMidoPanel')
const mmSettings = document.querySelector('#miniMidoSettings')

document.querySelector('#miniMidoLauncher').addEventListener('click', () => {
  mmPanel.hidden = !mmPanel.hidden
})

document.querySelector('#miniMidoClose').addEventListener('click', () => {
  mmPanel.hidden = true
})

function fillMiniMidoSettings() {
  document.querySelector('#mmName').value = miniMidoSettings.name
  document.querySelector('#mmPersonality').value = miniMidoSettings.personality
  document.querySelector('#mmLanguage').value = miniMidoSettings.language
  document.querySelector('#mmStyle').value = miniMidoSettings.style
  document.querySelector('#mmRules').value = miniMidoSettings.rules
  document.querySelector('#mmExtra').value = miniMidoSettings.extra
}

function updateMiniMidoName() {
  const name = miniMidoSettings.name || miniMidoDefaults.name
  document.querySelector('#miniMidoLauncherName').textContent = name
  document.querySelector('#miniMidoTitle').textContent = name + ' 🪶'
  document.querySelector('#miniMidoWelcomeName').textContent = name
}

updateMiniMidoName()

document.querySelector('#miniMidoSettingsBtn').addEventListener('click', () => {
  mmSettings.hidden = !mmSettings.hidden
  if (!mmSettings.hidden) fillMiniMidoSettings()
})

document.querySelector('#mmSave').addEventListener('click', () => {
  miniMidoSettings = {
    name: document.querySelector('#mmName').value.trim() || miniMidoDefaults.name,
    personality: document.querySelector('#mmPersonality').value.trim(),
    language: document.querySelector('#mmLanguage').value.trim(),
    style: document.querySelector('#mmStyle').value.trim(),
    rules: document.querySelector('#mmRules').value.trim(),
    extra: document.querySelector('#mmExtra').value.trim()
  }

  localStorage.setItem('miniMidoSettings', JSON.stringify(miniMidoSettings))
  updateMiniMidoName()
  alert('تم حفظ إعدادات المساعد!')
  mmSettings.hidden = true
})

document.querySelector('#mmReset').addEventListener('click', () => {
  miniMidoSettings = { ...miniMidoDefaults }
  localStorage.setItem('miniMidoSettings', JSON.stringify(miniMidoSettings))
  fillMiniMidoSettings()
  updateMiniMidoName()
})

let miniMidoHistory = []

document.querySelector('#miniMidoForm').addEventListener('submit', async event => {
  event.preventDefault()

  const input = document.querySelector('#miniMidoInput')
  const message = input.value.trim()
  if (!message) return

  const chat = document.querySelector('#miniMidoChat')
  const submitButton = event.currentTarget.querySelector('button[type="submit"]')

  const userBubble = document.createElement('div')
  userBubble.className = 'mini-mido-message user'
  userBubble.textContent = message
  chat.appendChild(userBubble)

  const botBubble = document.createElement('div')
  botBubble.className = 'mini-mido-message bot'
  botBubble.textContent = (miniMidoSettings.name || miniMidoDefaults.name) + ' بيفكر...'
  chat.appendChild(botBubble)

  input.value = ''
  submitButton.disabled = true
  chat.scrollTop = chat.scrollHeight

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history: miniMidoHistory,
        settings: {
          ...miniMidoSettings,
          extra: [
            miniMidoSettings.extra,
            'معلومات ثابتة عن المشروع: مطوّرك هو ميدو، والاستوديو الذي طوّرك هو بالعربي 🪶، والمنصّة التي تعمل فيها هي TOOLBOX. عندما يسألك المستخدم عن مطوّرك أو استوديوك، أجب بهذه المعلومات بوضوح ولا تنسب تطويرك إلى جهة أخرى.'
          ].filter(Boolean).join('\n\n')
        }
      })
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'فشل الاتصال بالخادم.')
    if (!data.reply) throw new Error('لم يصل رد من Gemini.')

    botBubble.textContent = data.reply
    miniMidoHistory.push(
      { role: 'user', text: message },
      { role: 'model', text: data.reply }
    )
    miniMidoHistory = miniMidoHistory.slice(-12)
  } catch (error) {
    console.error('Mini Mido Error:', error)
    botBubble.textContent = 'حصل خطأ: ' + error.message
  } finally {
    submitButton.disabled = false
    input.focus()
    chat.scrollTop = chat.scrollHeight
  }
})