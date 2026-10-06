import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import { CharacterCount, Placeholder } from '@tiptap/extensions'
import { EditorContent, useEditor, type Editor as TiptapEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import prose from '../../components/ui/RichText.module.css'
import s from '../admin.module.css'
import e from './Editor.module.css'
import { api } from '../api'
import { preparePhoto } from '../images'
import {
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
  IconBold,
  IconItalic,
  IconLink,
  IconListBullet,
  IconListNumber,
  IconPhoto,
  IconQuoteBlock,
  IconRedo,
  IconRule,
  IconStrike,
  IconUnderline,
  IconUndo,
} from './icons'
import { cx } from '../format'
import { Spinner } from './ui'

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
const key = (k: string) => `${isMac ? '⌘' : 'Ctrl+'}${k}`

function Tool({
  label,
  shortcut,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string
  shortcut?: string
  active?: boolean
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      className={cx(e.tool, active && e.toolOn)}
      onMouseDown={(ev) => ev.preventDefault()} // keep the text selection
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      aria-label={label}
      title={shortcut ? `${label} (${shortcut})` : label}
    >
      {children}
    </button>
  )
}

type Style = 'p' | 'h2' | 'h3'

/**
 * Word-style editor for blog posts. Paste from Word or Google Docs keeps headings, bold, lists and links;
 * anything else is cleaned away so the post always matches the website's styles.
 */
export function Editor({
  value,
  onChange,
  onError,
}: {
  value: string
  onChange: (html: string) => void
  onError: (message: string) => void
}) {
  const fileInput = useRef<HTMLInputElement>(null)
  const linkDialog = useRef<HTMLDialogElement>(null)
  const [linkUrl, setLinkUrl] = useState('')
  const [uploading, setUploading] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        link: { openOnClick: false, autolink: true, defaultProtocol: 'https', HTMLAttributes: { rel: 'noopener noreferrer' } },
      }),
      Image.configure({ inline: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Start writing your post here… Use the toolbar above for headings, lists and photos.' }),
      CharacterCount,
    ],
    content: value,
    shouldRerenderOnTransaction: true,
    editorProps: { attributes: { class: cx(prose.prose, e.content), 'aria-label': 'Post text', role: 'textbox', 'aria-multiline': 'true' } },
    onUpdate: ({ editor: ed }) => onChange(ed.isEmpty ? '' : ed.getHTML()),
  })

  // Load a different post's body without recreating the editor.
  useEffect(() => {
    if (editor && value !== editor.getHTML() && !(editor.isEmpty && !value)) {
      editor.commands.setContent(value, { emitUpdate: false })
    }
  }, [editor, value])

  if (!editor) return null
  const ed: TiptapEditor = editor
  const chain = () => ed.chain().focus()

  const style: Style = ed.isActive('heading', { level: 2 }) ? 'h2' : ed.isActive('heading', { level: 3 }) ? 'h3' : 'p'
  const setStyle = (v: Style) =>
    v === 'p' ? chain().setParagraph().run() : chain().toggleHeading({ level: v === 'h2' ? 2 : 3 }).run()

  const openLink = () => {
    setLinkUrl((ed.getAttributes('link').href as string | undefined) ?? '')
    linkDialog.current?.showModal()
  }
  const applyLink = () => {
    const url = linkUrl.trim()
    if (!url) chain().extendMarkRange('link').unsetLink().run()
    else {
      const href = /^(https?:|mailto:|tel:|\/)/i.test(url) ? url : `https://${url}`
      chain().extendMarkRange('link').setLink({ href }).run()
    }
    linkDialog.current?.close()
  }

  const addPhoto = async (file: File | undefined) => {
    if (!file) return
    setUploading(true)
    try {
      const { url } = await api.upload(await preparePhoto(file))
      chain().setImage({ src: url, alt: '' }).run()
    } catch (err) {
      onError(err instanceof Error ? err.message : 'The photo could not be added.')
    } finally {
      setUploading(false)
    }
  }

  const words = ed.storage.characterCount.words()

  return (
    <div className={e.wrap}>
      <div className={e.toolbar} role="toolbar" aria-label="Formatting">
        <label className={e.styleSelect}>
          <span className="visually-hidden">Paragraph style</span>
          <select className={s.select} value={style} onChange={(ev) => setStyle(ev.target.value as Style)}>
            <option value="p">Normal text</option>
            <option value="h2">Heading</option>
            <option value="h3">Subheading</option>
          </select>
        </label>
        <span className={e.sep} />
        <Tool label="Bold" shortcut={key('B')} active={ed.isActive('bold')} onClick={() => chain().toggleBold().run()}>
          <IconBold size={18} />
        </Tool>
        <Tool label="Italic" shortcut={key('I')} active={ed.isActive('italic')} onClick={() => chain().toggleItalic().run()}>
          <IconItalic size={18} />
        </Tool>
        <Tool label="Underline" shortcut={key('U')} active={ed.isActive('underline')} onClick={() => chain().toggleUnderline().run()}>
          <IconUnderline size={18} />
        </Tool>
        <Tool label="Strikethrough" active={ed.isActive('strike')} onClick={() => chain().toggleStrike().run()}>
          <IconStrike size={18} />
        </Tool>
        <span className={e.sep} />
        <Tool label="Bulleted list" active={ed.isActive('bulletList')} onClick={() => chain().toggleBulletList().run()}>
          <IconListBullet size={18} />
        </Tool>
        <Tool label="Numbered list" active={ed.isActive('orderedList')} onClick={() => chain().toggleOrderedList().run()}>
          <IconListNumber size={18} />
        </Tool>
        <Tool label="Quote" active={ed.isActive('blockquote')} onClick={() => chain().toggleBlockquote().run()}>
          <IconQuoteBlock size={18} />
        </Tool>
        <span className={e.sep} />
        <Tool label="Align left" active={ed.isActive({ textAlign: 'left' })} onClick={() => chain().setTextAlign('left').run()}>
          <IconAlignLeft size={18} />
        </Tool>
        <Tool label="Centre" active={ed.isActive({ textAlign: 'center' })} onClick={() => chain().setTextAlign('center').run()}>
          <IconAlignCenter size={18} />
        </Tool>
        <Tool label="Align right" active={ed.isActive({ textAlign: 'right' })} onClick={() => chain().setTextAlign('right').run()}>
          <IconAlignRight size={18} />
        </Tool>
        <span className={e.sep} />
        <Tool label="Link" shortcut={key('K')} active={ed.isActive('link')} onClick={openLink}>
          <IconLink size={18} />
        </Tool>
        <Tool label="Insert photo" disabled={uploading} onClick={() => fileInput.current?.click()}>
          {uploading ? <Spinner /> : <IconPhoto size={18} />}
        </Tool>
        <Tool label="Dividing line" onClick={() => chain().setHorizontalRule().run()}>
          <IconRule size={18} />
        </Tool>
        <span className={e.sep} />
        <Tool label="Undo" shortcut={key('Z')} disabled={!ed.can().undo()} onClick={() => chain().undo().run()}>
          <IconUndo size={18} />
        </Tool>
        <Tool label="Redo" shortcut={isMac ? '⌘⇧Z' : 'Ctrl+Y'} disabled={!ed.can().redo()} onClick={() => chain().redo().run()}>
          <IconRedo size={18} />
        </Tool>
        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          onChange={(ev) => {
            void addPhoto(ev.target.files?.[0])
            ev.target.value = ''
          }}
        />
      </div>

      <div
        className={e.page}
        onKeyDown={(ev) => {
          if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === 'k') {
            ev.preventDefault()
            openLink()
          }
        }}
      >
        <EditorContent editor={ed} />
      </div>

      <div className={e.status}>
        <span>
          {words} word{words === 1 ? '' : 's'} · about {Math.max(1, Math.round(words / 200))} min read
        </span>
        <span>Tip: paste straight from Word — headings, bold and lists are kept.</span>
      </div>

      <dialog ref={linkDialog} className={s.dialog} aria-labelledby="link-title">
        <form
          method="dialog"
          onSubmit={(ev) => {
            ev.preventDefault()
            applyLink()
          }}
        >
          <div className={s.dialogBody}>
            <h2 id="link-title" className={s.dialogTitle}>
              Add a link
            </h2>
            <label className={s.field}>
              <span className={s.label}>Web address</span>
              <input
                className={s.input}
                value={linkUrl}
                onChange={(ev) => setLinkUrl(ev.target.value)}
                placeholder="e.g. www.bis.gov.in or /services"
                autoFocus
              />
              <span className={s.hint}>Select some text first, then add the link. Leave empty to remove a link.</span>
            </label>
          </div>
          <div className={s.dialogActions}>
            <button type="button" className={s.smallBtn} onClick={() => linkDialog.current?.close()}>
              Cancel
            </button>
            <button type="submit" className={cx(s.smallBtn, s.smallPrimary)}>
              {linkUrl.trim() ? 'Apply link' : 'Remove link'}
            </button>
          </div>
        </form>
      </dialog>
    </div>
  )
}
