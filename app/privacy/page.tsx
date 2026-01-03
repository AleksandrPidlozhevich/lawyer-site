"use client";

export const runtime = 'edge';

import { useLocale } from '@/context/LocaleContext';
import { ru } from '@/locales/ru';
import { en } from '@/locales/en';
import { by } from '@/locales/by';

export default function PrivacyPolicy() {
    const { locale } = useLocale();
    const t = locale === 'ru' ? ru : locale === 'en' ? en : by;

    const privacyContent = {
        ru: {
            title: "Политика конфиденциальности",
            lastUpdated: "Последнее обновление: ",
            sections: [
                {
                    title: "1. Общие положения",
                    content: "Настоящая Политика конфиденциальности определяет порядок обработки персональных данных пользователей сайта адвоката Пидложевич Николая Евстафьевича."
                },
                {
                    title: "2. Какие данные мы собираем",
                    content: "Мы собираем следующие персональные данные:\n• Имя и фамилия\n• Адрес электронной почты\n• Номер телефона\n• Дата и время консультации"
                },
                {
                    title: "3. Цели обработки данных",
                    content: "Ваши персональные данные используются для:\n• Организации юридических консультаций\n• Связи с вами для подтверждения записи\n• Предоставления юридических услуг"
                },
                {
                    title: "4. Хранение и защита данных",
                    content: "Мы обеспечиваем безопасность ваших данных и храним их только в течение необходимого времени для предоставления услуг."
                },
                {
                    title: "5. Ваши права",
                    content: "Вы имеете право на доступ, исправление, удаление ваших персональных данных. Для этого обратитесь к нам по контактным данным."
                },
                {
                    title: "6. Контактная информация",
                    content: "По вопросам обработки персональных данных обращайтесь:\nАдвокат Пидложевич Николай Евстафьевич\nТелефон: +375 (XX) XXX-XX-XX\nEmail: info@lawyer.by"
                }
            ]
        },
        en: {
            title: "Privacy Policy",
            lastUpdated: "Last updated: ",
            sections: [
                {
                    title: "1. General Provisions",
                    content: "This Privacy Policy defines the procedure for processing personal data of users of the website of lawyer Mykolai Pidlazhevich."
                },
                {
                    title: "2. What Data We Collect",
                    content: "We collect the following personal data:\n• Name and surname\n• Email address\n• Phone number\n• Date and time of consultation"
                },
                {
                    title: "3. Purposes of Data Processing",
                    content: "Your personal data is used for:\n• Organizing legal consultations\n• Contacting you to confirm appointments\n• Providing legal services"
                },
                {
                    title: "4. Data Storage and Protection",
                    content: "We ensure the security of your data and store it only for the time necessary to provide services."
                },
                {
                    title: "5. Your Rights",
                    content: "You have the right to access, correct, delete your personal data. To do this, contact us using the contact information."
                },
                {
                    title: "6. Contact Information",
                    content: "For questions about personal data processing, contact:\nLawyer Mykolai Pidlazhevich\nPhone: +375 (XX) XXX-XX-XX\nEmail: info@lawyer.by"
                }
            ]
        },
        by: {
            title: "Палітыка канфідэнцыяльнасці",
            lastUpdated: "Апошняе абнаўленне: ",
            sections: [
                {
                    title: "1. Агульныя палажэнні",
                    content: "Дадзеная Палітыка канфідэнцыяльнасці вызначае парадак апрацоўкі персанальных дадзеных карыстальнікаў сайта адваката Підлажэвіча Мікалая Яўстаф'евіча."
                },
                {
                    title: "2. Якія дадзеныя мы збіраем",
                    content: "Мы збіраем наступныя персанальныя дадзеныя:\n• Імя і прозвішча\n• Адрас электроннай пошты\n• Нумар тэлефона\n• Дата і час кансультацыі"
                },
                {
                    title: "3. Мэты апрацоўкі дадзеных",
                    content: "Вашы персанальныя дадзеныя выкарыстоўваюцца для:\n• Арганізацыі юрыдычных кансультацый\n• Сувязі з вамі для пацвярджэння запісу\n• Прадастаўлення юрыдычных паслуг"
                },
                {
                    title: "4. Захаванне і абарона дадзеных",
                    content: "Мы забяспечваем бяспеку вашых дадзеных і захоўваем іх толькі на працягу неабходнага часу для прадастаўлення паслуг."
                },
                {
                    title: "5. Вашы правы",
                    content: "Вы маеце права на доступ, выпраўленне, выдаленне вашых персанальных дадзеных. Для гэтага звярніцеся да нас па кантактных дадзеных."
                },
                {
                    title: "6. Кантактная інфармацыя",
                    content: "Па пытаннях апрацоўкі персанальных дадзеных звяртайцеся:\nАдвакат Підлажэвіч Мікалай Яўстаф'евіч\nТэлефон: +375 (XX) XXX-XX-XX\nEmail: info@lawyer.by"
                }
            ]
        }
    };

    const content = privacyContent[locale as keyof typeof privacyContent];

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-foreground">{content.title}</h1>
            <p className="text-sm text-muted-foreground mb-8">
                {content.lastUpdated}{new Date().toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'en' ? 'en-US' : 'be-BY')}
            </p>
            
            <div className="space-y-6">
                {content.sections.map((section, index) => (
                    <div key={index} className="bg-card p-6 rounded-lg border">
                        <h2 className="text-xl font-semibold mb-3 text-foreground">{section.title}</h2>
                        <div className="text-muted-foreground whitespace-pre-line">
                            {section.content}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}