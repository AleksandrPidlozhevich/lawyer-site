export default function Footer() {
    return (
        <footer className="bg-footer text-foreground text-center py-6 mt-10 transition-colors">
            <p>© {new Date().getFullYear()} Пидложевич. Все права защищены.</p>
        </footer>
    );
}
