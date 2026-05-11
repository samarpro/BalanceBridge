import { Monitor01, Moon02, Sun } from "@untitledui/icons";
import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group";
import { useTheme } from "@/providers/theme-provider";
import { t } from "@/i18n/strings";

type ThemeKey = "light" | "dark" | "system";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <ButtonGroup
            aria-label={t("aria.themeMode")}
            selectedKeys={new Set<ThemeKey>([theme])}
            onSelectionChange={(keys) => {
                const next = [...keys][0] as ThemeKey | undefined;
                if (next) setTheme(next);
            }}
            size="sm"
            className="max-w-full shrink-0"
        >
            <ButtonGroupItem id="light" iconLeading={Sun}>
                {t("theme.light")}
            </ButtonGroupItem>
            <ButtonGroupItem id="dark" iconLeading={Moon02}>
                {t("theme.dark")}
            </ButtonGroupItem>
            <ButtonGroupItem id="system" iconLeading={Monitor01}>
                {t("theme.system")}
            </ButtonGroupItem>
        </ButtonGroup>
    );
}
