"use client";

import { NumberField } from "@base-ui-components/react/number-field";
import { Select } from "@base-ui-components/react/select";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { type ThemeMode, useTheme } from "@/hooks/useTheme";
import styles from "./BibsGenerator.module.css";

// Theme mode options
const THEME_OPTIONS = [
  { value: "system", label: "システム", icon: "💻" },
  { value: "light", label: "ライト", icon: "☀️" },
  { value: "dark", label: "ダーク", icon: "🌙" },
] as const;

// Font options for bibs
const FONT_OPTIONS = [
  { value: "Electric Boots", label: "Electric Boots" },
  { value: "Bebas Neue", label: "Bebas Neue" },
  { value: "Arial Black", label: "Arial Black" },
  { value: "Impact", label: "Impact" },
  { value: "Oswald", label: "Oswald" },
  { value: "Roboto Condensed", label: "Roboto Condensed" },
] as const;

// Size presets for bike front plates
const SIZE_PRESETS = [
  { name: "モトクロス", width: 280, height: 230, icon: "🏍️" },
  { name: "エンデューロ", width: 250, height: 200, icon: "🏁" },
  { name: "ロードレース", width: 200, height: 180, icon: "🏎️" },
  { name: "ミニバイク", width: 180, height: 150, icon: "🛵" },
  { name: "カスタム", width: 0, height: 0, icon: "⚙️" },
] as const;

// Color presets
const COLOR_PRESETS = [
  { name: "クラシック", bg: "#FFFFFF", text: "#000000" },
  { name: "イエロー", bg: "#FFD700", text: "#000000" },
  { name: "レッド", bg: "#FF0000", text: "#FFFFFF" },
  { name: "ブルー", bg: "#0066FF", text: "#FFFFFF" },
  { name: "グリーン", bg: "#00CC00", text: "#000000" },
  { name: "ブラック", bg: "#1A1A1A", text: "#FFFFFF" },
  { name: "オレンジ", bg: "#FF6600", text: "#000000" },
  { name: "ピンク", bg: "#FF69B4", text: "#000000" },
] as const;

// Number padding options
const PADDING_OPTIONS = [
  { value: 0, label: "なし (1, 2, 3)" },
  { value: 2, label: "2桁 (01, 02)" },
  { value: 3, label: "3桁 (001, 002)" },
] as const;

// Input mode options
const INPUT_MODES = [
  { value: "range", label: "範囲指定", icon: "📊" },
  { value: "free", label: "自由入力", icon: "✏️" },
] as const;

type InputMode = (typeof INPUT_MODES)[number]["value"];

// User mode options
const USER_MODES = [
  {
    value: "organizer",
    label: "主催者向け",
    icon: "🏢",
    description: "複数枚のゼッケンを一括生成",
  },
  { value: "participant", label: "参加者向け", icon: "🏍️", description: "自分のゼッケンを1枚印刷" },
] as const;

type UserMode = (typeof USER_MODES)[number]["value"];

interface BibConfig {
  startNumber: number;
  endNumber: number;
  font: string;
  fontSize: number;
  bgColor: string;
  textColor: string;
  bibWidth: number;
  bibHeight: number;
  padding: number;
  selectedSizePreset: string;
}

export default function BibsGenerator() {
  const [config, setConfig] = useState<BibConfig>({
    startNumber: 1,
    endNumber: 10,
    font: "Electric Boots",
    fontSize: 140,
    bgColor: "#FFFFFF",
    textColor: "#000000",
    bibWidth: 280,
    bibHeight: 230,
    padding: 0,
    selectedSizePreset: "モトクロス",
  });

  const [previewNumber, setPreviewNumber] = useState(1);
  const [showPrintView, setShowPrintView] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>("range");
  const [freeInput, setFreeInput] = useState("1, 2, 3, 5, 7, 10");
  const [userMode, setUserMode] = useState<UserMode>("participant");
  const [participantNumber, setParticipantNumber] = useState(42);
  const { mode, setThemeMode, mounted } = useTheme();

  const bibNumbers = useMemo(() => {
    // Participant mode: single number
    if (userMode === "participant") {
      return [participantNumber];
    }
    // Organizer mode with free input
    if (inputMode === "free") {
      // Parse free input: support comma, space, newline separated values
      const parsed = freeInput
        .split(/[,\s\n]+/)
        .map((s) => s.trim())
        .filter((s) => s !== "")
        .map((s) => parseInt(s, 10))
        .filter((n) => !Number.isNaN(n) && n >= 0 && n <= 9999);
      // Remove duplicates and sort
      return [...new Set(parsed)].sort((a, b) => a - b);
    }
    // Organizer mode with range
    const numbers: number[] = [];
    const start = Math.min(config.startNumber, config.endNumber);
    const end = Math.max(config.startNumber, config.endNumber);
    for (let i = start; i <= end; i++) {
      numbers.push(i);
    }
    return numbers;
  }, [userMode, participantNumber, inputMode, freeInput, config.startNumber, config.endNumber]);

  // Reset preview number when bib numbers change
  useEffect(() => {
    if (bibNumbers.length > 0 && !bibNumbers.includes(previewNumber)) {
      setPreviewNumber(bibNumbers[0]);
    }
  }, [bibNumbers, previewNumber]);

  const formatNumber = useCallback(
    (num: number) => {
      if (config.padding === 0) return String(num);
      return String(num).padStart(config.padding, "0");
    },
    [config.padding]
  );

  const updateConfig = useCallback(<K extends keyof BibConfig>(key: K, value: BibConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handlePrint = useCallback(() => {
    setShowPrintView(true);
    setTimeout(() => {
      window.print();
      setShowPrintView(false);
    }, 100);
  }, []);

  const selectColorPreset = useCallback((preset: (typeof COLOR_PRESETS)[number]) => {
    setConfig((prev) => ({
      ...prev,
      bgColor: preset.bg,
      textColor: preset.text,
    }));
  }, []);

  const selectSizePreset = useCallback((preset: (typeof SIZE_PRESETS)[number]) => {
    if (preset.name === "カスタム") {
      setConfig((prev) => ({
        ...prev,
        selectedSizePreset: preset.name,
      }));
    } else {
      setConfig((prev) => ({
        ...prev,
        bibWidth: preset.width,
        bibHeight: preset.height,
        selectedSizePreset: preset.name,
      }));
    }
  }, []);

  return (
    <>
      <div className={styles.container}>
        {/* Header */}
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        >
          <div className={styles.headerTop}>
            <div className={styles.logoContainer}>
              <span className={styles.logoIcon}>🏁</span>
              <h1 className={styles.logo}>BIBGEN</h1>
            </div>
            {mounted && (
              <button
                type="button"
                className={styles.themeToggle}
                onClick={() => {
                  const modes: ThemeMode[] = ["system", "light", "dark"];
                  const currentIndex = modes.indexOf(mode);
                  const nextIndex = (currentIndex + 1) % modes.length;
                  setThemeMode(modes[nextIndex]);
                }}
                aria-label={`テーマ: ${THEME_OPTIONS.find((opt) => opt.value === mode)?.label}`}
                title={THEME_OPTIONS.find((opt) => opt.value === mode)?.label}
              >
                <span className={styles.themeIcon}>
                  {THEME_OPTIONS.find((opt) => opt.value === mode)?.icon}
                </span>
              </button>
            )}
          </div>
          <p className={styles.tagline}>バイク用ゼッケンナンバージェネレーター</p>

          {/* User Mode Toggle */}
          <div className={styles.userModeToggle}>
            {USER_MODES.map((mode) => (
              <button
                type="button"
                key={mode.value}
                className={`${styles.userModeButton} ${
                  userMode === mode.value ? styles.userModeActive : ""
                }`}
                onClick={() => setUserMode(mode.value)}
              >
                <span className={styles.userModeIcon}>{mode.icon}</span>
                <span className={styles.userModeLabel}>{mode.label}</span>
                <span className={styles.userModeDesc}>{mode.description}</span>
              </button>
            ))}
          </div>
        </motion.header>

        <div className={styles.mainGrid}>
          {/* Controls Panel */}
          <motion.aside
            className={styles.controlsPanel}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
          >
            {/* Size Presets */}
            <div className={styles.controlSection}>
              <h2 className={styles.sectionTitle}>サイズ</h2>
              <div className={styles.sizePresets}>
                {SIZE_PRESETS.map((preset) => (
                  <button
                    type="button"
                    key={preset.name}
                    className={`${styles.sizePreset} ${
                      config.selectedSizePreset === preset.name ? styles.sizePresetActive : ""
                    }`}
                    onClick={() => selectSizePreset(preset)}
                  >
                    <span className={styles.presetIcon}>{preset.icon}</span>
                    <span className={styles.presetName}>{preset.name}</span>
                    {preset.width > 0 && (
                      <span className={styles.presetSize}>
                        {preset.width}×{preset.height}mm
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {config.selectedSizePreset === "カスタム" && (
                <div className={styles.customSize}>
                  <div className={styles.sizeInputRow}>
                    <label>幅 (mm)</label>
                    <NumberField.Root
                      value={config.bibWidth}
                      onValueChange={(val) => updateConfig("bibWidth", val ?? 200)}
                      min={100}
                      max={500}
                    >
                      <NumberField.Group className={styles.numberFieldGroup}>
                        <NumberField.Decrement className={styles.numberButton}>
                          −
                        </NumberField.Decrement>
                        <NumberField.Input className={styles.numberInput} />
                        <NumberField.Increment className={styles.numberButton}>
                          +
                        </NumberField.Increment>
                      </NumberField.Group>
                    </NumberField.Root>
                  </div>
                  <div className={styles.sizeInputRow}>
                    <label>高さ (mm)</label>
                    <NumberField.Root
                      value={config.bibHeight}
                      onValueChange={(val) => updateConfig("bibHeight", val ?? 150)}
                      min={80}
                      max={400}
                    >
                      <NumberField.Group className={styles.numberFieldGroup}>
                        <NumberField.Decrement className={styles.numberButton}>
                          −
                        </NumberField.Decrement>
                        <NumberField.Input className={styles.numberInput} />
                        <NumberField.Increment className={styles.numberButton}>
                          +
                        </NumberField.Increment>
                      </NumberField.Group>
                    </NumberField.Root>
                  </div>
                </div>
              )}
            </div>

            {/* Number Settings */}
            <div className={styles.controlSection}>
              <h2 className={styles.sectionTitle}>番号設定</h2>

              {userMode === "participant" ? (
                /* Participant Mode: Single Number Input */
                <div className={styles.participantInput}>
                  <label className={styles.label}>あなたのゼッケン番号</label>
                  <div className={styles.participantNumberInput}>
                    <NumberField.Root
                      value={participantNumber}
                      onValueChange={(val) => setParticipantNumber(val ?? 1)}
                      min={0}
                      max={9999}
                    >
                      <NumberField.Group className={styles.participantNumberGroup}>
                        <NumberField.Decrement className={styles.participantNumberButton}>
                          −
                        </NumberField.Decrement>
                        <NumberField.Input className={styles.participantNumberField} />
                        <NumberField.Increment className={styles.participantNumberButton}>
                          +
                        </NumberField.Increment>
                      </NumberField.Group>
                    </NumberField.Root>
                  </div>
                  <span className={styles.hint}>主催者から指定された番号を入力してください</span>
                </div>
              ) : (
                /* Organizer Mode: Range or Free Input */
                <>
                  <div className={styles.inputModeToggle}>
                    {INPUT_MODES.map((mode) => (
                      <button
                        type="button"
                        key={mode.value}
                        className={`${styles.inputModeButton} ${
                          inputMode === mode.value ? styles.inputModeActive : ""
                        }`}
                        onClick={() => setInputMode(mode.value)}
                      >
                        <span className={styles.inputModeIcon}>{mode.icon}</span>
                        {mode.label}
                      </button>
                    ))}
                  </div>

                  {inputMode === "range" ? (
                    <div className={styles.controlGroup}>
                      <label className={styles.label}>番号範囲</label>
                      <div className={styles.rangeInputs}>
                        <NumberField.Root
                          value={config.startNumber}
                          onValueChange={(val) => updateConfig("startNumber", val ?? 1)}
                          min={0}
                          max={9999}
                        >
                          <NumberField.Group className={styles.numberFieldGroup}>
                            <NumberField.Decrement className={styles.numberButton}>
                              −
                            </NumberField.Decrement>
                            <NumberField.Input className={styles.numberInput} />
                            <NumberField.Increment className={styles.numberButton}>
                              +
                            </NumberField.Increment>
                          </NumberField.Group>
                        </NumberField.Root>
                        <span className={styles.rangeSeparator}>〜</span>
                        <NumberField.Root
                          value={config.endNumber}
                          onValueChange={(val) => updateConfig("endNumber", val ?? 10)}
                          min={0}
                          max={9999}
                        >
                          <NumberField.Group className={styles.numberFieldGroup}>
                            <NumberField.Decrement className={styles.numberButton}>
                              −
                            </NumberField.Decrement>
                            <NumberField.Input className={styles.numberInput} />
                            <NumberField.Increment className={styles.numberButton}>
                              +
                            </NumberField.Increment>
                          </NumberField.Group>
                        </NumberField.Root>
                      </div>
                      <span className={styles.hint}>{bibNumbers.length}枚のゼッケンを生成</span>
                    </div>
                  ) : (
                    <div className={styles.controlGroup}>
                      <label className={styles.label}>番号を入力</label>
                      <textarea
                        className={styles.freeInputTextarea}
                        value={freeInput}
                        onChange={(e) => setFreeInput(e.target.value)}
                        placeholder="例: 1, 3, 5, 7, 10&#10;または改行区切り"
                        rows={4}
                      />
                      <span className={styles.hint}>
                        カンマ・スペース・改行で区切って入力 → {bibNumbers.length}枚
                      </span>
                    </div>
                  )}
                </>
              )}

              <div className={styles.controlGroup}>
                <label className={styles.label}>桁揃え</label>
                <div className={styles.paddingOptions}>
                  {PADDING_OPTIONS.map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      className={`${styles.paddingOption} ${
                        config.padding === opt.value ? styles.paddingOptionActive : ""
                      }`}
                      onClick={() => updateConfig("padding", opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Font Settings */}
            <div className={styles.controlSection}>
              <h2 className={styles.sectionTitle}>フォント</h2>
              <div className={styles.controlGroup}>
                <label className={styles.label}>書体</label>
                <Select.Root
                  value={config.font}
                  onValueChange={(val) => val && updateConfig("font", val)}
                >
                  <Select.Trigger className={styles.selectTrigger}>
                    <Select.Value />
                    <Select.Icon className={styles.selectIcon}>▼</Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Positioner>
                      <Select.Popup className={styles.selectPopup}>
                        {FONT_OPTIONS.map((font) => (
                          <Select.Item
                            key={font.value}
                            value={font.value}
                            className={styles.selectOption}
                          >
                            <Select.ItemIndicator className={styles.optionIndicator}>
                              ✓
                            </Select.ItemIndicator>
                            <Select.ItemText>{font.label}</Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Popup>
                    </Select.Positioner>
                  </Select.Portal>
                </Select.Root>
              </div>

              <div className={styles.controlGroup}>
                <label className={styles.label}>サイズ: {config.fontSize}px</label>
                <input
                  type="range"
                  min="40"
                  max="200"
                  value={config.fontSize}
                  onChange={(e) => updateConfig("fontSize", parseInt(e.target.value, 10))}
                  className={styles.slider}
                />
              </div>
            </div>

            {/* Color Settings */}
            <div className={styles.controlSection}>
              <h2 className={styles.sectionTitle}>カラー</h2>
              <div className={styles.colorPresets}>
                {COLOR_PRESETS.map((preset) => (
                  <button
                    type="button"
                    key={preset.name}
                    className={`${styles.colorPreset} ${
                      config.bgColor === preset.bg ? styles.colorPresetActive : ""
                    }`}
                    style={{
                      background: preset.bg,
                      color: preset.text,
                    }}
                    onClick={() => selectColorPreset(preset)}
                    title={preset.name}
                  >
                    <span className={styles.presetNumber}>42</span>
                  </button>
                ))}
              </div>

              <div className={styles.customColors}>
                <div className={styles.colorInput}>
                  <label>背景色</label>
                  <input
                    type="color"
                    value={config.bgColor}
                    onChange={(e) => updateConfig("bgColor", e.target.value)}
                    className={styles.colorPicker}
                  />
                </div>
                <div className={styles.colorInput}>
                  <label>文字色</label>
                  <input
                    type="color"
                    value={config.textColor}
                    onChange={(e) => updateConfig("textColor", e.target.value)}
                    className={styles.colorPicker}
                  />
                </div>
              </div>
            </div>

            {/* Print Button */}
            <motion.button
              type="button"
              className={styles.printButton}
              onClick={handlePrint}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className={styles.printIcon}>🖨️</span>
              {userMode === "participant" ? "ゼッケンを印刷" : "すべてのゼッケンを印刷"}
            </motion.button>
          </motion.aside>

          {/* Preview Area */}
          <motion.main
            className={styles.previewArea}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          >
            <div className={styles.previewHeader}>
              <h2 className={styles.sectionTitle}>プレビュー</h2>
              <div className={styles.previewInfo}>
                <span className={styles.sizeInfo}>
                  {config.bibWidth} × {config.bibHeight} mm
                </span>
              </div>
            </div>

            <div className={styles.previewContainer}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={previewNumber}
                  className={styles.bibPreview}
                  style={{
                    backgroundColor: config.bgColor,
                    color: config.textColor,
                    fontFamily: config.font,
                    fontSize: `${config.fontSize}px`,
                    aspectRatio: `${config.bibWidth} / ${config.bibHeight}`,
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                >
                  <span className={styles.bibNumber}>{formatNumber(previewNumber)}</span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation - Only show for organizer mode with multiple bibs */}
            {userMode === "organizer" && bibNumbers.length > 1 && (
              <div className={styles.previewNav}>
                <button
                  type="button"
                  className={styles.navButton}
                  onClick={() => {
                    const currentIndex = bibNumbers.indexOf(previewNumber);
                    if (currentIndex > 0) {
                      setPreviewNumber(bibNumbers[currentIndex - 1]);
                    }
                  }}
                  disabled={bibNumbers.indexOf(previewNumber) <= 0}
                >
                  ← 前
                </button>
                <span className={styles.previewCounter}>
                  {formatNumber(previewNumber)} ({bibNumbers.indexOf(previewNumber) + 1}/
                  {bibNumbers.length})
                </span>
                <button
                  type="button"
                  className={styles.navButton}
                  onClick={() => {
                    const currentIndex = bibNumbers.indexOf(previewNumber);
                    if (currentIndex < bibNumbers.length - 1) {
                      setPreviewNumber(bibNumbers[currentIndex + 1]);
                    }
                  }}
                  disabled={bibNumbers.indexOf(previewNumber) >= bibNumbers.length - 1}
                >
                  次 →
                </button>
              </div>
            )}

            {/* Bib Grid Preview - Only show for organizer mode with multiple bibs */}
            {userMode === "organizer" && bibNumbers.length > 1 && (
              <div className={styles.gridPreview}>
                <h3 className={styles.gridTitle}>生成されるゼッケン一覧</h3>
                <div className={styles.bibGrid}>
                  {bibNumbers.slice(0, 30).map((num) => (
                    <motion.button
                      type="button"
                      key={num}
                      className={`${styles.gridBib} ${
                        num === previewNumber ? styles.gridBibActive : ""
                      }`}
                      style={{
                        backgroundColor: config.bgColor,
                        color: config.textColor,
                        fontFamily: config.font,
                        aspectRatio: `${config.bibWidth} / ${config.bibHeight}`,
                      }}
                      onClick={() => setPreviewNumber(num)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {formatNumber(num)}
                    </motion.button>
                  ))}
                  {bibNumbers.length > 30 && (
                    <span className={styles.moreIndicator}>+{bibNumbers.length - 30}枚</span>
                  )}
                </div>
              </div>
            )}
          </motion.main>
        </div>

        {/* Footer */}
        <motion.footer
          className={styles.footer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p>
            © FUNAI RACING {new Date().getFullYear()} | powered by{" "}
            <a
              href="https://funairacing.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              FUNAI RACING
            </a>
          </p>
        </motion.footer>
      </div>

      {/* Print View */}
      {showPrintView && (
        <div className={styles.printView}>
          {bibNumbers.map((num) => (
            <div
              key={num}
              className={styles.printBib}
              style={{
                backgroundColor: config.bgColor,
                color: config.textColor,
                fontFamily: config.font,
                fontSize: `${config.fontSize}px`,
                width: `${config.bibWidth}mm`,
                height: `${config.bibHeight}mm`,
              }}
            >
              <span>{formatNumber(num)}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
