"use client";
import type React from "react";
import RecruiterLayout from "../../RecruiterLayout";
import { useState, useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkboxx";
import { Button } from "@/components/ui/buttonn";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/selectt";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Link,
    List,
    ListOrdered,
    Clock,
    Upload,
    FileText,
    Check,
    X,
    ChevronDown,
    AlertCircle,
    MapPin,
    GraduationCap,
    Briefcase,
    Calendar,
} from "lucide-react";
import { getCurrentUser } from "@/lib/api/auth";
import { User } from "@supabase/supabase-js";

interface ValidationErrors {
    jobTitle?: string;
    jobDescription?: string;
    location?: string;
    requirements?: string;
    education?: string;
    experience?: string;
    employmentTypes?: string;
    selectedSchedules?: string;
    salaryAmount?: string;
    deadline?: string;
}

interface PendingJobOffer {
    id: string;
    data: any;
    timestamp: number;
    attempts: number;
}

export default function JobPostingForm() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState("manual");
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [location, setLocation] = useState("");
    const [requirements, setRequirements] = useState("");
    const [education, setEducation] = useState("");
    const [experience, setExperience] = useState("");
    const [deadline, setDeadline] = useState("");
    const [wordCount, setWordCount] = useState(0);
    const [employmentTypes, setEmploymentTypes] = useState({
        fullTime: true,
        partTime: true,
        onDemand: false,
        negotiable: false,
    });
    const [selectedSchedules, setSelectedSchedules] = useState<string[]>([]);
    const [paymentType, setPaymentType] = useState("custom");
    const [salaryAmount, setSalaryAmount] = useState("35,000");
    const [paymentFrequency, setPaymentFrequency] = useState("yearly");
    const [salaryNegotiable, setSalaryNegotiable] = useState(false);
    const [hiringMultiple, setHiringMultiple] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [extractedData, setExtractedData] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [apiStatus, setApiStatus] = useState<
        "unknown" | "connected" | "disconnected"
    >("unknown");
    const [pendingOffers, setPendingOffers] = useState<PendingJobOffer[]>([]);

    const saveJobDescriptionToStorage = (description: string) => {
        if (typeof window !== "undefined") {
            localStorage.setItem("jobDescription", description);
        }
    };

    const loadJobDescriptionFromStorage = (): string => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("jobDescription") || "";
        }
        return "";
    };

    const clearJobDescriptionFromStorage = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("jobDescription");
        }
    };

    const savePendingOfferToStorage = (offer: PendingJobOffer) => {
        if (typeof window !== "undefined") {
            const existingOffers = JSON.parse(
                localStorage.getItem("pendingJobOffers") || "[]"
            );
            const updatedOffers = [...existingOffers, offer];
            localStorage.setItem("pendingJobOffers", JSON.stringify(updatedOffers));
            setPendingOffers(updatedOffers);
        }
    };

    const loadPendingOffersFromStorage = (): PendingJobOffer[] => {
        if (typeof window !== "undefined") {
            const offers = JSON.parse(
                localStorage.getItem("pendingJobOffers") || "[]"
            );
            setPendingOffers(offers);
            return offers;
        }
        return [];
    };

    const removePendingOfferFromStorage = (offerId: string) => {
        if (typeof window !== "undefined") {
            const existingOffers = JSON.parse(
                localStorage.getItem("pendingJobOffers") || "[]"
            );
            const updatedOffers = existingOffers.filter(
                (offer: PendingJobOffer) => offer.id !== offerId
            );
            localStorage.setItem("pendingJobOffers", JSON.stringify(updatedOffers));
            setPendingOffers(updatedOffers);
        }
    };

    const editorRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const retryIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const scheduleOptions = [
        "Quart de jour",
        "Quart de nuit",
        "Disponibilité le week-end",
    ];
    const educationOptions = [
        "Lycée",
        "Licence",
        "Master",
        "Doctorat",
        "Certificat professionnel",
        "Aucune formation formelle requise",
    ];

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error("Error fetching user:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const loadContent = () => {
            const savedDescription = loadJobDescriptionFromStorage();
            if (savedDescription && editorRef.current) {
                editorRef.current.innerHTML = savedDescription;
                setJobDescription(savedDescription);
                setTimeout(() => {
                    updateWordCount();
                }, 100);
            }
        };

        loadContent();
        const timer = setTimeout(loadContent, 500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (jobDescription) {
            saveJobDescriptionToStorage(jobDescription);
        }
    }, [jobDescription]);

    useEffect(() => {
        checkAPIConnection();
        loadPendingOffersFromStorage();
        startRetryProcess();

        return () => {
            if (retryIntervalRef.current) {
                clearInterval(retryIntervalRef.current);
            }
        };
    }, []);

    const checkAPIConnection = async () => {
        try {
            const response = await fetch("http://localhost:5000/offers/", {
                method: "GET",
                mode: "cors",
                signal: AbortSignal.timeout(5000),
            });

            if (response.ok) {
                setApiStatus("connected");
                return true;
            } else {
                setApiStatus("disconnected");
                return false;
            }
        } catch (error) {
            setApiStatus("disconnected");
            return false;
        }
    };

    const hasPendingOffers = (): boolean => {
        if (typeof window !== "undefined") {
            const offers = JSON.parse(
                localStorage.getItem("pendingJobOffers") || "[]"
            );
            return offers.length > 0;
        }
        return false;
    };

    const startRetryProcess = () => {
        if (retryIntervalRef.current) {
            clearInterval(retryIntervalRef.current);
        }

        if (!hasPendingOffers()) {
            return;
        }

        retryIntervalRef.current = setInterval(async () => {
            const isConnected = await checkAPIConnection();
            if (isConnected) {
                await processPendingOffers();
            }
        }, 12 * 60 * 60 * 1000);
    };

    const processPendingOffers = async () => {
        const offers = loadPendingOffersFromStorage();

        if (offers.length === 0) {
            if (retryIntervalRef.current) {
                clearInterval(retryIntervalRef.current);
                retryIntervalRef.current = null;
            }
            return;
        }

        for (const offer of offers) {
            try {
                await submitToFlaskAPI(offer.data);
                removePendingOfferFromStorage(offer.id);
                console.log(`Offre en attente soumise avec succès : ${offer.id}`);
            } catch (error) {
                console.log(
                    `Échec de la soumission de l'offre en attente : ${offer.id}`,
                    error
                );
            }
        }

        const remainingOffers = loadPendingOffersFromStorage();
        if (remainingOffers.length === 0) {
            if (retryIntervalRef.current) {
                clearInterval(retryIntervalRef.current);
                retryIntervalRef.current = null;
            }
        }
    };

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};

        if (!jobTitle.trim()) {
            newErrors.jobTitle = "Le titre du poste est requis";
        } else if (jobTitle.trim().length < 3) {
            newErrors.jobTitle =
                "Le titre du poste doit comporter au moins 3 caractères";
        }

        if (!jobDescription.trim() || jobDescription.trim() === "<br>") {
            newErrors.jobDescription = "La description du poste est requise";
        } else if (wordCount < 10) {
            newErrors.jobDescription =
                "La description du poste doit comporter au moins 10 mots";
        }

        if (!location.trim()) {
            newErrors.location = "L'emplacement est requis";
        }

        if (!requirements.trim()) {
            newErrors.requirements = "Les exigences sont requises";
        }

        if (!education.trim()) {
            newErrors.education = "Le niveau d'éducation est requis";
        }

        if (!experience.trim()) {
            newErrors.experience = "L'expérience est requise";
        }

        if (!deadline.trim()) {
            newErrors.deadline = "La date limite de candidature est requise";
        }

        const hasSelectedEmploymentType =
            Object.values(employmentTypes).some(Boolean);
        if (!hasSelectedEmploymentType) {
            newErrors.employmentTypes =
                "Au moins un type d'emploi doit être sélectionné";
        }

        if (selectedSchedules.length === 0) {
            newErrors.selectedSchedules =
                "Au moins un horaire de travail doit être sélectionné";
        }

        if (!salaryAmount.trim()) {
            newErrors.salaryAmount = "Le montant du salaire est requis";
        } else if (isNaN(Number(salaryAmount.replace(/,/g, "")))) {
            newErrors.salaryAmount = "Veuillez entrer un montant de salaire valide";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const updateWordCount = () => {
        if (editorRef.current) {
            const text = editorRef.current.innerText || "";
            const cleanText = text.replace(/\s+/g, " ").trim();
            const words =
                cleanText === ""
                    ? 0
                    : cleanText.split(" ").filter((word) => word.length > 0).length;
            setWordCount(words);
        }
    };

    const formatText = (command: string) => {
        document.execCommand(command, false, undefined);
        editorRef.current?.focus();
        setTimeout(updateWordCount, 100);
    };

    const insertLink = () => {
        const selection = window.getSelection();
        if (selection && selection.toString()) {
            const selectedText = selection.toString();
            const url = prompt(
                "Entrez l'URL (par exemple, https://www.google.com) :"
            );
            if (url) {
                let finalUrl = url;
                if (!url.startsWith("http://") && !url.startsWith("https://")) {
                    finalUrl = "https://" + url;
                }
                const link = `<a href="${finalUrl}" target="_blank" style="color: #2563eb; text-decoration: underline;">${selectedText}</a>`;
                document.execCommand("insertHTML", false, link);
                editorRef.current?.focus();
                setTimeout(updateWordCount, 100);
            }
        } else {
            alert("Veuillez d'abord sélectionner du texte pour ajouter un lien");
        }
    };

    const insertTextAtCursor = (textToInsert: string) => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            const textNode = document.createTextNode(textToInsert);
            range.insertNode(textNode);
            range.setStartAfter(textNode);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            editorRef.current?.focus();
            setTimeout(updateWordCount, 100);
        }
    };

    const addBulletPoint = () => {
        if (editorRef.current) {
            editorRef.current.focus();
            insertTextAtCursor("• ");
        }
    };

    const addNumberedPoint = () => {
        if (editorRef.current) {
            editorRef.current.focus();
            const content = editorRef.current.innerText || "";
            const numberRegex = /^(\d+)\./gm;
            let maxNumber = 0;
            let match;
            while ((match = numberRegex.exec(content)) !== null) {
                const num = Number.parseInt(match[1], 10);
                if (num > maxNumber) {
                    maxNumber = num;
                }
            }
            const nextNumber = maxNumber + 1;
            insertTextAtCursor(`${nextNumber}. `);
        }
    };

    const handleEditorClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName === "A") {
            e.preventDefault();
            const href = target.getAttribute("href");
            if (href) {
                window.open(href, "_blank");
            }
        }
        editorRef.current?.focus();
    };

    const handleEditorInput = () => {
        if (editorRef.current) {
            const content = editorRef.current.innerHTML;
            setJobDescription(content);
            updateWordCount();
            if (errors.jobDescription) {
                setErrors((prev) => ({ ...prev, jobDescription: undefined }));
            }
        }
    };

    const handleEditorKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            document.execCommand("insertHTML", false, "<br><br>");
            setTimeout(updateWordCount, 100);
        }
    };

    const setEditorContent = (content: string) => {
        if (editorRef.current) {
            editorRef.current.innerHTML = content;
            setJobDescription(content);
            saveJobDescriptionToStorage(content);

            setTimeout(() => {
                updateWordCount();
                if (editorRef.current) {
                    editorRef.current.style.minHeight = "140px";
                    editorRef.current.focus();

                    const range = document.createRange();
                    const selection = window.getSelection();
                    range.selectNodeContents(editorRef.current);
                    range.collapse(false);
                    selection?.removeAllRanges();
                    selection?.addRange(range);
                }
            }, 100);
        }
    };

    const extractJobDataFromText = (text: string) => {
        const lines = text
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0);

        let extractedJobTitle = "";
        const titleKeywords = [
            "titre du poste",
            "position",
            "rôle",
            "offre d'emploi",
            "poste vacant",
        ];

        for (let i = 0; i < Math.min(lines.length, 5); i++) {
            const line = lines[i].toLowerCase();
            const hasKeyword = titleKeywords.some((keyword) =>
                line.includes(keyword)
            );

            if (hasKeyword) {
                const colonIndex = lines[i].indexOf(":");
                if (colonIndex !== -1) {
                    extractedJobTitle = lines[i].substring(colonIndex + 1).trim();
                }
                break;
            } else if (i === 0 && lines[i].length < 100) {
                extractedJobTitle = lines[i];
            }
        }

        let extractedJobDescription = "";
        const descKeywords = [
            "description",
            "responsabilités",
            "tâches",
            "exigences",
            "à propos",
        ];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].toLowerCase();
            const hasDescKeyword = descKeywords.some((keyword) =>
                line.includes(keyword)
            );

            if (hasDescKeyword && i + 1 < lines.length) {
                const descLines = lines.slice(i + 1, Math.min(i + 6, lines.length));
                if (descLines.length > 0) {
                    extractedJobDescription = descLines.join("<br>");
                    break;
                }
            }
        }

        if (!extractedJobDescription && text.length > 100) {
            const sentences = text
                .split(/[.!?]+/)
                .filter((s) => s.trim().length > 20);
            if (sentences.length > 0) {
                extractedJobDescription = sentences.slice(0, 3).join(". ").trim();
                if (!extractedJobDescription.endsWith(".")) {
                    extractedJobDescription += ".";
                }
            }
        }

        if (!extractedJobDescription) {
            extractedJobDescription = text.substring(0, 200).trim();
            if (extractedJobDescription.length === 200) {
                extractedJobDescription += "...";
            }
        }

        const fullText = text.toLowerCase();
        let extractedRequirements = "";

        const reqKeywords = [
            "exigences",
            "compétences",
            "technologies",
            "qualifications",
        ];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].toLowerCase();
            const hasReqKeyword = reqKeywords.some((keyword) =>
                line.includes(keyword)
            );

            if (hasReqKeyword && i + 1 < lines.length) {
                const reqLines = lines.slice(i + 1, Math.min(i + 5, lines.length));
                extractedRequirements = reqLines.join(", ").replace(/[•-]/g, "").trim();
                break;
            }
        }

        const extractedEmploymentTypes = {
            fullTime:
                fullText.includes("temps plein") || fullText.includes("full-time"),
            partTime:
                fullText.includes("temps partiel") || fullText.includes("part-time"),
            onDemand:
                fullText.includes("sur demande") ||
                fullText.includes("freelance") ||
                fullText.includes("contrat"),
            negotiable:
                fullText.includes("négociable") || fullText.includes("flexible"),
        };

        const extractedSchedules: string[] = [];
        if (
            fullText.includes("quart de jour") ||
            fullText.includes("matin") ||
            fullText.includes("journée")
        ) {
            extractedSchedules.push("Quart de jour");
        }
        if (
            fullText.includes("quart de nuit") ||
            fullText.includes("soir") ||
            fullText.includes("nuit")
        ) {
            extractedSchedules.push("Quart de nuit");
        }
        if (
            fullText.includes("week-end") ||
            fullText.includes("samedi") ||
            fullText.includes("dimanche")
        ) {
            extractedSchedules.push("Disponibilité le week-end");
        }

        let extractedSalaryAmount = "35,000";
        let extractedPaymentFrequency = "annuel";
        const extractedSalaryNegotiable = fullText.includes("négociable");

        const salaryPatterns = [
            /\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:par\s+)?(an|annuel|annuellement)/i,
            /\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:par\s+)?(mois|mensuel)/i,
            /\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:par\s+)?(heure|horaire)/i,
        ];

        for (const pattern of salaryPatterns) {
            const match = text.match(pattern);
            if (match) {
                extractedSalaryAmount = match[1];
                const frequency = match[2].toLowerCase();
                if (frequency.includes("heure")) {
                    extractedPaymentFrequency = "horaire";
                } else if (frequency.includes("mois")) {
                    extractedPaymentFrequency = "mensuel";
                } else if (frequency.includes("an") || frequency.includes("annuel")) {
                    extractedPaymentFrequency = "annuel";
                }
                break;
            }
        }

        const extractedHiringMultiple =
            fullText.includes("multiple") ||
            fullText.includes("plusieurs") ||
            fullText.includes("nombreux");

        return {
            jobTitle: extractedJobTitle || "Poste extrait",
            jobDescription: extractedJobDescription,
            location: "À distance",
            requirements:
                extractedRequirements || "Expérience avec les technologies pertinentes",
            education: "Licence",
            experience: "2 ans",
            employmentTypes: extractedEmploymentTypes,
            selectedSchedules: extractedSchedules,
            paymentType: "personnalisé",
            salaryAmount: extractedSalaryAmount,
            paymentFrequency: extractedPaymentFrequency,
            salaryNegotiable: extractedSalaryNegotiable,
            hiringMultiple: extractedHiringMultiple,
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
        };
    };

    const readFileContent = async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                resolve(content);
            };
            reader.onerror = () => {
                reject(new Error("Échec de la lecture du fichier"));
            };
            reader.readAsText(file);
        });
    };

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/msword",
            "text/plain",
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Veuillez télécharger uniquement des fichiers PDF, DOCX ou TXT");
            return;
        }

        setUploadedFile(file);
        setIsProcessing(true);

        try {
            const content = await readFileContent(file);
            const extractedJobData = extractJobDataFromText(content);
            setExtractedData(extractedJobData);
        } catch (error) {
            alert("Erreur lors de la lecture du fichier. Veuillez réessayer.");
            setUploadedFile(null);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleEmploymentTypeChange = (type: keyof typeof employmentTypes) => {
        setEmploymentTypes((prev) => {
            const newTypes = { ...prev, [type]: !prev[type] };
            if (errors.employmentTypes && Object.values(newTypes).some(Boolean)) {
                setErrors((prev) => ({ ...prev, employmentTypes: undefined }));
            }
            return newTypes;
        });
    };

    const handleScheduleToggle = (schedule: string) => {
        setSelectedSchedules((prev) => {
            const newSchedules = prev.includes(schedule)
                ? prev.filter((s) => s !== schedule)
                : [...prev, schedule];
            if (errors.selectedSchedules && newSchedules.length > 0) {
                setErrors((prev) => ({ ...prev, selectedSchedules: undefined }));
            }
            return newSchedules;
        });
    };

    const handleScheduleSelect = (schedule: string) => {
        if (!selectedSchedules.includes(schedule)) {
            setSelectedSchedules((prev) => {
                const newSchedules = [...prev, schedule];
                if (errors.selectedSchedules) {
                    setErrors((prev) => ({ ...prev, selectedSchedules: undefined }));
                }
                return newSchedules;
            });
        }
    };

    const applyExtractedData = () => {
        if (!extractedData) return;

        setJobTitle(extractedData.jobTitle);
        setLocation(extractedData.location);
        setRequirements(extractedData.requirements);
        setEducation(extractedData.education);
        setExperience(extractedData.experience);
        setDeadline(extractedData.deadline);
        setEmploymentTypes(extractedData.employmentTypes);
        setSelectedSchedules(extractedData.selectedSchedules);
        setPaymentType(extractedData.paymentType);
        setSalaryAmount(extractedData.salaryAmount);
        setPaymentFrequency(extractedData.paymentFrequency);
        setSalaryNegotiable(extractedData.salaryNegotiable);
        setHiringMultiple(extractedData.hiringMultiple);

        setTimeout(() => {
            if (extractedData.jobDescription) {
                setEditorContent(extractedData.jobDescription);
            }
        }, 100);

        setActiveTab("manual");
        setErrors({});
    };

    const resetExtractedData = () => {
        setExtractedData(null);
        setUploadedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const getContractType = () => {
        const selectedTypes = Object.entries(employmentTypes)
            .filter(([_, value]) => value)
            .map(([key, _]) => {
                const labels: any = {
                    fullTime: "Temps plein",
                    partTime: "Temps partiel",
                    onDemand: "Contrat",
                    negotiable: "Négociable",
                };
                return labels[key];
            });

        return selectedTypes[0] || "Temps plein";
    };

    const prepareFormDataForAPI = () => {
        const requirementsArray = requirements
            .split(",")
            .map((req) => req.trim())
            .filter((req) => req.length > 0);

        return {
            title: jobTitle.trim(),
            description: jobDescription.replace(/<[^>]*>/g, "").trim(),
            location: location.trim(),
            requirements: requirementsArray,
            education: education.trim(),
            experience: experience.trim(),
            contract_type: getContractType(),
            deadline: deadline,
            salary: Number.parseFloat(salaryAmount.replace(/,/g, "")),
        };
    };

    const submitToFlaskAPI = async (formData: any) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const headers = {
            "Content-Type": "application/json",
            "X-Recruiter-ID": user?.id || "3823eb09-f9f6-4bc7-a8f3-49e9aea76e1a",
            Accept: "application/json",
        };

        try {
            console.log(
                "Envoi des données à l'API Flask :",
                JSON.stringify(formData, null, 2)
            );

            const response = await fetch("http://localhost:5000/offers/create", {
                method: "POST",
                headers: headers,
                body: JSON.stringify(formData),
                signal: controller.signal,
                mode: "cors",
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Réponse d'erreur de l'API :", errorData);

                switch (response.status) {
                    case 415:
                        throw new Error(
                            "Type de média non supporté : Assurez-vous que Content-Type est application/json"
                        );
                    case 401:
                        throw new Error(
                            "Échec de l'authentification : ID de recruteur manquant"
                        );
                    case 403:
                        throw new Error(
                            "Accès refusé : Vous n'avez pas la permission de créer des offres"
                        );
                    case 500:
                        throw new Error(
                            "Erreur serveur : Veuillez vérifier tous les champs requis"
                        );
                    default:
                        throw new Error(`Erreur HTTP ! statut : ${response.status}`);
                }
            }

            const result = await response.json();
            console.log("Réponse de succès de l'API :", result);
            return result;
        } catch (error: any) {
            clearTimeout(timeoutId);
            console.error("Erreur de soumission :", error.message);

            if (error.name === "AbortError") {
                throw new Error(
                    "Délai de requête dépassé : Le serveur Flask ne répond pas"
                );
            }

            if (error.message.includes("fetch")) {
                throw new Error(
                    "Échec de la connexion : Assurez-vous que le serveur Flask est en cours d'exécution sur localhost:5000 avec CORS activé"
                );
            }

            throw error;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitSuccess(false);
        setSubmitError("");

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = prepareFormDataForAPI();
            console.log("Données du formulaire préparées :", formData);

            const isConnected = await checkAPIConnection();

            if (isConnected) {
                const result = await submitToFlaskAPI(formData);
                setSubmitSuccess(true);
                console.log("Offre d'emploi créée avec succès :", result);

                setTimeout(() => {
                    setSubmitSuccess(false);
                }, 5000);
            } else {
                const pendingOffer: PendingJobOffer = {
                    id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    data: formData,
                    timestamp: Date.now(),
                    attempts: 0,
                };

                savePendingOfferToStorage(pendingOffer);

                if (!retryIntervalRef.current) {
                    startRetryProcess();
                }

                setSubmitError(
                    "Le serveur est actuellement indisponible. Votre offre d'emploi a été enregistrée et sera soumise automatiquement lorsque le serveur sera de nouveau en ligne."
                );

                setTimeout(() => {
                    setSubmitError("");
                }, 8000);
            }
        } catch (error: any) {
            console.error("Erreur de soumission :", error);

            const formData = prepareFormDataForAPI();
            const pendingOffer: PendingJobOffer = {
                id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                data: formData,
                timestamp: Date.now(),
                attempts: 0,
            };

            savePendingOfferToStorage(pendingOffer);
            if (!retryIntervalRef.current) {
                startRetryProcess();
            }
            setSubmitError(
                "Échec de la soumission de l'offre d'emploi. Elle a été enregistrée localement et sera soumise automatiquement lorsque le serveur sera disponible."
            );

            setTimeout(() => {
                setSubmitError("");
            }, 8000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const testSampleFile = () => {
        const sampleText = `Titre du poste : Développeur Backend Senior

Description du poste :
Nous recherchons un Développeur Backend Senior qualifié pour rejoindre notre équipe dynamique. Le candidat idéal aura une vaste expérience avec Flask, PostgreSQL et les technologies backend modernes.

Emplacement : Tunis, Tunisie

Exigences :
- Flask et Python
- PostgreSQL et Supabase
- Développement d'API REST
- Contrôle de version Git
- Conteneurisation Docker

Éducation : Licence en informatique
Expérience : 3+ ans en développement backend

Responsabilités :
- Développer et maintenir des API REST avec Flask
- Concevoir et optimiser les schémas de base de données
- Collaborer avec les développeurs frontend
- Écrire un code propre, maintenable et bien documenté

Type d'emploi : Temps plein
Horaire : Quart de jour, horaires flexibles
Salaire : 48,000 par an
Date limite de candidature : 2025-12-30
Recrutement : Nous recrutons plusieurs candidats pour ce rôle`;

        setIsProcessing(true);

        setTimeout(() => {
            const extractedJobData = extractJobDataFromText(sampleText);
            setExtractedData(extractedJobData);
            setUploadedFile(
                new File([sampleText], "sample-job-posting.txt", { type: "text/plain" })
            );
            setIsProcessing(false);
        }, 1000);
    };

    const isEditorEmpty = !jobDescription || jobDescription.trim() === "";

    useEffect(() => {
        if (
            editorRef.current &&
            jobDescription &&
            editorRef.current.innerHTML !== jobDescription
        ) {
            editorRef.current.innerHTML = jobDescription;
            updateWordCount();
        }
    }, [jobDescription]);

    const handleInputChange = (field: string, value: string) => {
        switch (field) {
            case "jobTitle":
                setJobTitle(value);
                if (errors.jobTitle && value.trim().length >= 3) {
                    setErrors((prev) => ({ ...prev, jobTitle: undefined }));
                }
                break;
            case "location":
                setLocation(value);
                if (errors.location && value.trim()) {
                    setErrors((prev) => ({ ...prev, location: undefined }));
                }
                break;
            case "requirements":
                setRequirements(value);
                if (errors.requirements && value.trim()) {
                    setErrors((prev) => ({ ...prev, requirements: undefined }));
                }
                break;
            case "experience":
                setExperience(value);
                if (errors.experience && value.trim()) {
                    setErrors((prev) => ({ ...prev, experience: undefined }));
                }
                break;
            case "deadline":
                setDeadline(value);
                if (errors.deadline && value.trim()) {
                    setErrors((prev) => ({ ...prev, deadline: undefined }));
                }
                break;
            case "salaryAmount":
                setSalaryAmount(value);
                if (errors.salaryAmount && value.trim()) {
                    setErrors((prev) => ({ ...prev, salaryAmount: undefined }));
                }
                break;
        }
    };

    if (loading) {
        return   <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
      <div
        className="w-12 h-12 border-4 border-gray-300 rounded-full animate-spin"
      />
    </div>;
    }

    return (
        <>
  <RecruiterLayout  user={user}>
    <div className="overflow-hidden bg-inherit">
            <div
                className="min-h-screen p-4 md:p-8 bg-center bg-cover bg-no-repeat xl:translate-x-8 translate-x-8 "
                style={{ backgroundImage: 'url("/images/bg-form.png")' }}
            >
                <div className="mx-auto  max-w-5xl ">
                    <div className="xl:rounded-lg bg-white p-8 shadow-lg -translate-x-4 ">
                        {pendingOffers.length > 0 && (
                            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                                <div className="flex items-center">
                                    <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                                    <p className="text-yellow-800 font-medium">
                                        Vous avez {pendingOffers.length} offre
                                        {pendingOffers.length > 1 ? "s" : ""} d'emploi en attente de
                                        soumission lorsque le serveur sera disponible.
                                    </p>
                                </div>
                            </div>
                        )}

                        <Tabs
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="w-full"
                        >
                            <TabsList className="grid w-full grid-cols-2 mb-8 bg-[#F1F5F9]">
                                <TabsTrigger
                                    value="manual"
                                    className="flex items-center gap-2 text-black"
                                >
                                    <FileText className="h-4 w-4 text-black" />
                                    Saisie manuelle
                                </TabsTrigger>
                                <TabsTrigger
                                    value="import"
                                    className="flex items-center gap-2 text-black"
                                >
                                    <Upload className="h-4 w-4 text-black" />
                                    Importer un document
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="manual">
                                <form onSubmit={handleSubmit}>
                                    <div className="flex justify-between items-center mb-8">
                                        <h2 className="text-2xl font-semibold text-gray-900">
                                            Formulaire d'offre d'emploi
                                        </h2>
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                setJobTitle("");
                                                setJobDescription("");
                                                setLocation("");
                                                setRequirements("");
                                                setEducation("");
                                                setExperience("");
                                                setDeadline("");
                                                setEmploymentTypes({
                                                    fullTime: true,
                                                    partTime: true,
                                                    onDemand: false,
                                                    negotiable: false,
                                                });
                                                setSelectedSchedules([]);
                                                setSalaryAmount("35,000");
                                                setSalaryNegotiable(false);
                                                setHiringMultiple(false);
                                                setErrors({});

                                                if (editorRef.current) {
                                                    editorRef.current.innerHTML = "";
                                                }

                                                clearJobDescriptionFromStorage();

                                                setWordCount(0);
                                            }}
                                            variant="outline"
                                            className="border-red-500 text-red-600 hover:bg-red-50 flex items-center gap-2"
                                        >
                                            <X className="h-4 w-4" />
                                            Effacer toutes les données
                                        </Button>
                                    </div>
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                            <div>
                                                <Label className="text-lg font-semibold text-gray-900 block mb-2">
                                                    Titre du poste *
                                                </Label>
                                                <p className="text-sm text-gray-600">
                                                    Le titre du poste doit décrire un seul poste
                                                </p>
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="par exemple, 'Développeur Backend'"
                                                    value={jobTitle}
                                                    onChange={(e) =>
                                                        handleInputChange("jobTitle", e.target.value)
                                                    }
                                                    className={`w-full h-12 px-3 border rounded-md focus:ring-1 outline-none text-gray-900 ${errors.jobTitle
                                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                        }`}
                                                />
                                                {errors.jobTitle && (
                                                    <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {errors.jobTitle}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="opacity-50"><hr /></div>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                            <div>
                                                <Label className="text-lg font-semibold text-gray-900 block mb-2">
                                                    Description du poste *
                                                </Label>
                                                <p className="text-sm text-gray-600">
                                                    Fournissez une courte description du poste. Soyez bref
                                                    et précis.
                                                </p>
                                            </div>
                                            <div>
                                                <div
                                                    className={`border rounded-md ${errors.jobDescription
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between border-b border-gray-200 p-3 bg-gray-50">
                                                        <div className="flex items-center xl:space-x-1 space-x-0.5">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 hover:bg-gray-200"
                                                                onClick={() => formatText("bold")}
                                                            >
                                                                <Bold className="h-4 w-4 text-black" />
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 hover:bg-gray-200"
                                                                onClick={() => formatText("italic")}
                                                            >
                                                                <Italic className="h-4 w-4 text-black" />
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 hover:bg-gray-200"
                                                                onClick={() => formatText("underline")}
                                                            >
                                                                <Underline className="h-4 w-4 text-black" />
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 hover:bg-gray-200"
                                                                onClick={() => formatText("strikeThrough")}
                                                            >
                                                                <Strikethrough className="h-4 w-4 text-black" />
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 hover:bg-gray-200"
                                                                onClick={insertLink}
                                                            >
                                                                <Link className="h-4 w-4 text-black" />
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 hover:bg-gray-200"
                                                                onClick={addBulletPoint}
                                                            >
                                                                <List className="h-4 w-4 text-black" />
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 hover:bg-gray-200"
                                                                onClick={addNumberedPoint}
                                                            >
                                                                <ListOrdered className="h-4 w-4 text-black" />
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 hover:bg-red-200 text-red-600"
                                                                onClick={() => {
                                                                    if (editorRef.current) {
                                                                        editorRef.current.innerHTML = "";
                                                                        setJobDescription("");
                                                                        clearJobDescriptionFromStorage();
                                                                        updateWordCount();
                                                                    }
                                                                }}
                                                                title="Effacer la description"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="xl:text-sm text-[7px]  text-gray-500">
                                                                {wordCount} mots
                                                            </span>
                                                            {jobDescription && (
                                                                <span className="text-green-600 xl:text-xs text-[7px] -translate-x-1 xl:translate-x-0">
                                                                    Enregistré
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="relative">
                                                        <div
                                                            key={jobDescription ? "has-content" : "empty"}
                                                            ref={editorRef}
                                                            contentEditable
                                                            className="min-h-[140px] p-3 focus:outline-none text-gray-900"
                                                            style={{ lineHeight: "1.5" }}
                                                            onInput={handleEditorInput}
                                                            onKeyDown={handleEditorKeyDown}
                                                            onClick={handleEditorClick}
                                                            suppressContentEditableWarning={true}
                                                        />
                                                        {isEditorEmpty && (
                                                            <div className="absolute left-3 top-3 text-gray-400 pointer-events-none select-none">
                                                                Description
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                {errors.jobDescription && (
                                                    <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {errors.jobDescription}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="opacity-50"><hr /></div>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                            <div>
                                                <Label className="text-lg font-semibold text-gray-900 block mb-2">
                                                    Emplacement *
                                                </Label>
                                                <p className="text-sm text-gray-600">
                                                    Où sera situé ce poste ?
                                                </p>
                                            </div>
                                            <div>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="par exemple, 'Tunis, Tunisie' ou 'À distance'"
                                                        value={location}
                                                        onChange={(e) =>
                                                            handleInputChange("location", e.target.value)
                                                        }
                                                        className={`w-full h-12 pl-10 pr-3 border rounded-md focus:ring-1 outline-none text-gray-900 ${errors.location
                                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                            }`}
                                                    />
                                                </div>
                                                {errors.location && (
                                                    <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {errors.location}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="opacity-50"><hr /></div>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                            <div>
                                                <Label className="text-lg font-semibold text-gray-900 block mb-2">
                                                    Exigences *
                                                </Label>
                                                <p className="text-sm text-gray-600">
                                                    Listez les compétences et technologies requises,
                                                    séparées par des virgules
                                                </p>
                                            </div>
                                            <div>
                                                <textarea
                                                    placeholder="par exemple, Flask, PostgreSQL, Python, API REST, Git"
                                                    value={requirements}
                                                    onChange={(e) =>
                                                        handleInputChange("requirements", e.target.value)
                                                    }
                                                    rows={4}
                                                    className={`w-full px-3 py-2 border rounded-md focus:ring-1 outline-none text-gray-900 resize-none ${errors.requirements
                                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                        }`}
                                                />
                                                {errors.requirements && (
                                                    <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {errors.requirements}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="opacity-50"><hr /></div>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                            <div>
                                                <Label className="text-lg font-semibold text-gray-900 block mb-2">
                                                    Éducation *
                                                </Label>
                                                <p className="text-sm text-gray-600">
                                                    Niveau d'éducation requis
                                                </p>
                                            </div>
                                            <div>
                                                <div className="relative">
                                                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Select
                                                        value={education}
                                                        onValueChange={(value) => {
                                                            setEducation(value);
                                                            if (errors.education) {
                                                                setErrors((prev) => ({
                                                                    ...prev,
                                                                    education: undefined,
                                                                }));
                                                            }
                                                        }}
                                                    >
                                                        <SelectTrigger
                                                            className={`w-full h-12 text-black data-radix-select-trigger-icon [&>svg]:hidden pl-10 ${errors.education
                                                                ? "border-red-500 focus:border-red-500"
                                                                : "border-gray-300 focus:border-blue-500 focus:ring-white"
                                                                }`}
                                                        >
                                                            <SelectValue placeholder="Sélectionner le niveau d'éducation" />
                                                            <ChevronDown className="h-6 w-6 inline-block! text-blue-600" />
                                                        </SelectTrigger>
                                                        <SelectContent className="text-black bg-[#F1F5F9]">
                                                            {educationOptions.map((option) => (
                                                                <SelectItem key={option} value={option}>
                                                                    {option}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                {errors.education && (
                                                    <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {errors.education}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="opacity-50"><hr /></div>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                            <div>
                                                <Label className="text-lg font-semibold text-gray-900 block mb-2">
                                                    Expérience *
                                                </Label>
                                                <p className="text-sm text-gray-600">
                                                    Années d'expérience requises
                                                </p>
                                            </div>
                                            <div>
                                                <div className="relative">
                                                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="par exemple, '2 ans' ou 'Niveau débutant'"
                                                        value={experience}
                                                        onChange={(e) =>
                                                            handleInputChange("experience", e.target.value)
                                                        }
                                                        className={`w-full h-12 pl-10 pr-3 border rounded-md focus:ring-1 outline-none text-gray-900 ${errors.experience
                                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                            }`}
                                                    />
                                                </div>
                                                {errors.experience && (
                                                    <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {errors.experience}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="opacity-50"><hr /></div>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                            <div>
                                                <Label className="text-lg font-semibold text-gray-900 block mb-2">
                                                    Date limite de candidature *
                                                </Label>
                                                <p className="text-sm text-gray-600">
                                                    Dernière date pour postuler à ce poste
                                                </p>
                                            </div>
                                            <div>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <input
                                                        type="date"
                                                        value={deadline}
                                                        onChange={(e) =>
                                                            handleInputChange("deadline", e.target.value)
                                                        }
                                                        min={new Date().toISOString().split("T")[0]}
                                                        className={`w-full h-12 pl-10 pr-3 border rounded-md focus:ring-1 outline-none text-gray-900 ${errors.deadline
                                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                            }`}
                                                    />
                                                </div>
                                                {errors.deadline && (
                                                    <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {errors.deadline}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="opacity-50"><hr /></div>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                            <div>
                                                <Label className="text-lg font-semibold text-gray-900 block mb-2">
                                                    Type d'emploi *
                                                </Label>
                                                <p className="text-sm text-gray-600">
                                                    Sélectionnez au moins un type d'emploi
                                                </p>
                                            </div>
                                            <div className="space-y-3">
                                                {[
                                                    { key: "fullTime", label: "Temps plein" },
                                                    { key: "partTime", label: "Temps partiel" },
                                                    { key: "onDemand", label: "Contrat" },
                                                    { key: "negotiable", label: "Négociable" },
                                                ].map(({ key, label }) => (
                                                    <div
                                                        key={key}
                                                        className={`flex items-center text-black space-x-3 p-4 border rounded-md transition-colors ${employmentTypes[key as keyof typeof employmentTypes]
                                                            ? "border-blue-600"
                                                            : errors.employmentTypes
                                                                ? "border-red-500 hover:border-red-400"
                                                                : "border-gray-200 hover:border-gray-300"
                                                            }`}
                                                    >
                                                        <Checkbox
                                                            id={key}
                                                            checked={
                                                                employmentTypes[
                                                                key as keyof typeof employmentTypes
                                                                ]
                                                            }
                                                            onCheckedChange={() =>
                                                                handleEmploymentTypeChange(
                                                                    key as keyof typeof employmentTypes
                                                                )
                                                            }
                                                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:text-white data-[state=checked]:border-blue-600"
                                                        />
                                                        <Label
                                                            htmlFor={key}
                                                            className="text-sm font-medium cursor-pointer flex-1"
                                                        >
                                                            {label}
                                                        </Label>
                                                    </div>
                                                ))}
                                                {errors.employmentTypes && (
                                                    <div className="flex items-center gap-1 text-red-600 text-sm">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {errors.employmentTypes}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="opacity-50"><hr /></div>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                            <div>
                                                <Label className="text-lg font-semibold text-gray-900 block mb-2">
                                                    Horaire de travail *
                                                </Label>
                                                <p className="text-sm text-gray-600">
                                                    Vous pouvez sélectionner plusieurs horaires de travail.
                                                </p>
                                            </div>
                                            <div className="space-y-4">
                                                <Select onValueChange={handleScheduleSelect}>
                                                    <SelectTrigger
                                                        className={`w-full h-12 data-radix-select-trigger-icon [&>svg]:hidden focus:ring-blue-500 text-black ${errors.selectedSchedules
                                                            ? "border-red-500 focus:border-red-500"
                                                            : "border-gray-300 focus:border-blue-500  focus:ring-white"
                                                            }`}
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <Clock className="h-4 w-4" />
                                                            <span>Choisir l'horaire de travail</span>
                                                        </div>
                                                        <ChevronDown className="h-6 w-6 inline-block!  text-blue-600" />
                                                    </SelectTrigger>
                                                    <SelectContent className="text-black bg-[#F1F5F9]">
                                                        {scheduleOptions.map((schedule) => (
                                                            <SelectItem key={schedule} value={schedule}>
                                                                {schedule}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>

                                                <div className="flex flex-wrap gap-2">
                                                    {scheduleOptions.map((schedule) => (
                                                        <Badge
                                                            key={schedule}
                                                            variant={
                                                                selectedSchedules.includes(schedule)
                                                                    ? "default"
                                                                    : "outline"
                                                            }
                                                            className={`cursor-pointer px-3 py-1  text-sm transition-colors flex items-center gap-1 ${selectedSchedules.includes(schedule)
                                                                ? "bg-[#eef6fe] text-gray-800 font-light hover:bg-blue-200"
                                                                : "bg-[#d4dce3] text-gray-800 font-light hover:bg-blue-300"
                                                                }`}
                                                            onClick={() => handleScheduleToggle(schedule)}
                                                        >
                                                            {selectedSchedules.includes(schedule) && (
                                                                <Check className="h-3 w-3 text-green-600" />
                                                            )}
                                                            {schedule}
                                                        </Badge>
                                                    ))}
                                                </div>

                                                {errors.selectedSchedules && (
                                                    <div className="flex items-center gap-1 text-red-600 text-sm">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {errors.selectedSchedules}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="opacity-50"><hr /></div>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                            <div>
                                                <Label className="text-lg font-semibold text-gray-900 block mb-2">
                                                    Salaire *
                                                </Label>
                                                <p className="text-sm text-gray-600">
                                                    Montant du salaire annuel
                                                </p>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div
                                                        className={`cursor-pointer border-2 p-4 text-center transition-all bg-inherit ${paymentType === "hourly"
                                                            ? "border-blue-500 bg-blue-50"
                                                            : "border-gray-200 hover:border-gray-300 bg-white"
                                                            }`}
                                                        onClick={() => setPaymentType("hourly")}
                                                    >
                                                        <div className="flex items-center mb-3">
                                                            <div
                                                                className={`w-4 h-4 rounded-full border-2 ${paymentType === "hourly"
                                                                    ? "border-blue-500 bg-blue-500"
                                                                    : "border-gray-300"
                                                                    }`}
                                                            >
                                                                {paymentType === "hourly" && (
                                                                    <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <Clock className="mx-auto h-6 w-6 text-blue-600 mb-2" />
                                                        <p
                                                            className={`font-medium ${paymentType === "custom"
                                                                ? " text-black"
                                                                : "text-blue-600"
                                                                }`}
                                                        >
                                                            Horaire
                                                        </p>
                                                    </div>
                                                    <div
                                                        className={`cursor-pointer border-2 p-4 text-center transition-all bg-inherit ${paymentType === "custom"
                                                            ? "border-blue-500 bg-blue-50"
                                                            : "border-gray-200 hover:border-gray-300 bg-white"
                                                            }`}
                                                        onClick={() => setPaymentType("custom")}
                                                    >
                                                        <div className="flex items-center mb-3">
                                                            <div
                                                                className={`w-4 h-4 rounded-full border-2 ${paymentType === "custom"
                                                                    ? "border-blue-500 bg-blue-500"
                                                                    : "border-gray-300"
                                                                    }`}
                                                            >
                                                                {paymentType === "custom" && (
                                                                    <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <svg
                                                            className="mx-auto h-8 w-8 text-gray-600 mb-2"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width={24}
                                                            height={24}
                                                            fill="none"
                                                            stroke="#2E6AD4"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <rect
                                                                x={3}
                                                                y={7}
                                                                width={18}
                                                                height={10}
                                                                rx={2}
                                                                ry={2}
                                                                stroke="#2E6AD4"
                                                                fill="none"
                                                            />
                                                            <circle cx={12} cy={12} r={2} fill="#2E6AD4" />
                                                            <circle cx={7} cy={12} r={1} fill="#2E6AD4" />
                                                            <circle cx={17} cy={12} r={1} fill="#2E6AD4" />
                                                        </svg>

                                                        <p
                                                            className={`font-medium ${paymentType === "custom"
                                                                ? "text-blue-600"
                                                                : " text-black"
                                                                }`}
                                                        >
                                                            Personnalisé
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-medium text-gray-700">
                                                            Montant que vous souhaitez payer
                                                        </Label>
                                                        <input
                                                            type="text"
                                                            value={salaryAmount}
                                                            onChange={(e) =>
                                                                handleInputChange("salaryAmount", e.target.value)
                                                            }
                                                            className={`w-full h-12 px-3 border rounded-md focus:ring-0 outline-none text-gray-500 ${errors.salaryAmount
                                                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                                : "border-gray-300 focus:border-blue-500 focus:ring-white"
                                                                }`}
                                                        />
                                                        {errors.salaryAmount && (
                                                            <div className="flex items-center gap-1 text-red-600 text-sm">
                                                                <AlertCircle className="h-4 w-4" />
                                                                {errors.salaryAmount}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-medium text-gray-700">
                                                            Comment vous souhaitez payer
                                                        </Label>
                                                        <Select
                                                            value={paymentFrequency}
                                                            onValueChange={setPaymentFrequency}
                                                        >
                                                            <SelectTrigger className="h-12 border-gray-300 data-radix-select-trigger-icon [&>svg]:hidden text-black focus:border-blue-500 focus:ring-white">
                                                                <SelectValue />
                                                                <ChevronDown className="h-6 w-6 inline-block! text-blue-600" />
                                                            </SelectTrigger>
                                                            <SelectContent className="text-black bg-[#F1F5F9]">
                                                                <SelectItem value="hourly">Horaire</SelectItem>
                                                                <SelectItem value="daily">Quotidien</SelectItem>
                                                                <SelectItem value="weekly">
                                                                    Hebdomadaire
                                                                </SelectItem>
                                                                <SelectItem value="monthly">Mensuel</SelectItem>
                                                                <SelectItem value="yearly">Annuel</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-3">
                                                    <Checkbox
                                                        id="salary-negotiable"
                                                        checked={salaryNegotiable}
                                                        onCheckedChange={(checked) =>
                                                            setSalaryNegotiable(checked === true)
                                                        }
                                                        className="data-[state=checked]:bg-blue-600 border-black data-[state=checked]:border-blue-600"
                                                    />
                                                    <Label
                                                        htmlFor="salary-negotiable"
                                                        className="text-sm font-medium cursor-pointer text-black"
                                                    >
                                                        Le salaire est négociable
                                                    </Label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="opacity-50"><hr /></div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                            <div>
                                                <Label className="text-lg font-semibold text-gray-900 block mb-2">
                                                    Recrutement de plusieurs candidats ?
                                                </Label>
                                                <p className="text-sm text-gray-600">
                                                    Cela sera affiché sur la page de l'offre pour que les
                                                    candidats puissent le voir.
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-3 border border-gray-300 p-3">
                                                <Checkbox
                                                    id="hiring-multiple"
                                                    checked={hiringMultiple}
                                                    onCheckedChange={(checked) =>
                                                        setHiringMultiple(checked === true)
                                                    }
                                                    className="data-[state=checked]:bg-blue-600 border-black data-[state=checked]:border-blue-600"
                                                />
                                                <Label
                                                    htmlFor="hiring-multiple"
                                                    className="text-sm font-medium cursor-pointer text-gray-600"
                                                >
                                                    Oui, je recrute plusieurs candidats
                                                </Label>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end pt-6">
                                            {submitSuccess && (
                                                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md w-full">
                                                    <div className="flex items-center">
                                                        <Check className="h-5 w-5 text-green-600 mr-2" />
                                                        <p className="text-green-800 font-medium">
                                                            Offre d'emploi créée avec succès !
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {submitError && (
                                                <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-md w-full">
                                                    <div className="flex items-center">
                                                        <Clock className="h-5 w-5 text-orange-600 mr-2" />
                                                        <p className="text-orange-800 font-medium">
                                                            {submitError}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="bg-blue-600 hover:bg-blue-700 px-8 py-2 disabled:opacity-50"
                                            >
                                                {isSubmitting
                                                    ? "Création de l'offre..."
                                                    : "Créer l'offre d'emploi"}
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </TabsContent>

                            <TabsContent value="import">
                                <div className="space-y-6">
                                    {!extractedData ? (
                                        <Card>
                                            <CardContent className="p-8">
                                                <div className="text-center">
                                                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                        Télécharger le document de l'offre
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mb-6">
                                                        Téléchargez un fichier TXT pour de meilleurs
                                                        résultats. Le support PDF et DOCX est limité.
                                                    </p>

                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept=".pdf,.docx,.doc,.txt"
                                                        onChange={handleFileUpload}
                                                        className="hidden"
                                                    />

                                                    <Button
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        disabled={isProcessing}
                                                        className="bg-blue-600 hover:bg-blue-700 mr-4"
                                                    >
                                                        {isProcessing
                                                            ? "Traitement..."
                                                            : "Choisir un fichier"}
                                                    </Button>

                                                    <Button
                                                        type="button"
                                                        onClick={testSampleFile}
                                                        disabled={isProcessing}
                                                        variant="outline"
                                                        className="border-green-600 text-green-600 hover:bg-green-50"
                                                    >
                                                        Tester un fichier exemple
                                                    </Button>

                                                    {uploadedFile && (
                                                        <div className="mt-4 p-3 bg-gray-50 rounded-md">
                                                            <p className="text-sm text-gray-700">
                                                                Fichier téléchargé : {uploadedFile.name}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <div className="space-y-6">
                                            <Card>
                                                <CardContent className="p-6">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            Données extraites du document
                                                        </h3>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                onClick={applyExtractedData}
                                                                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                                                            >
                                                                <Check className="h-4 w-4" />
                                                                Appliquer les données
                                                            </Button>
                                                            <Button
                                                                onClick={resetExtractedData}
                                                                variant="outline"
                                                                className="flex items-center gap-2 text-black"
                                                            >
                                                                <X className="h-4 w-4 text-black" />
                                                                Annuler
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4 text-sm text-black">
                                                        <div>
                                                            <strong>Titre du poste :</strong>{" "}
                                                            {extractedData.jobTitle}
                                                        </div>
                                                        <div>
                                                            <strong>Description du poste :</strong>{" "}
                                                            {extractedData.jobDescription}
                                                        </div>
                                                        <div>
                                                            <strong>Emplacement :</strong>{" "}
                                                            {extractedData.location}
                                                        </div>
                                                        <div>
                                                            <strong>Exigences :</strong>{" "}
                                                            {extractedData.requirements}
                                                        </div>
                                                        <div>
                                                            <strong>Éducation :</strong>{" "}
                                                            {extractedData.education}
                                                        </div>
                                                        <div>
                                                            <strong>Expérience :</strong>{" "}
                                                            {extractedData.experience}
                                                        </div>
                                                        <div>
                                                            <strong>Type d'emploi :</strong>{" "}
                                                            {Object.entries(extractedData.employmentTypes)
                                                                .filter(([_, value]) => value)
                                                                .map(([key, _]) => {
                                                                    const labels: any = {
                                                                        fullTime: "Temps plein",
                                                                        partTime: "Temps partiel",
                                                                        onDemand: "Contrat",
                                                                        negotiable: "Négociable",
                                                                    };
                                                                    return labels[key];
                                                                })
                                                                .join(", ")}
                                                        </div>
                                                        <div>
                                                            <strong>Horaire de travail :</strong>{" "}
                                                            {extractedData.selectedSchedules.join(", ") ||
                                                                "Aucun détecté"}
                                                        </div>
                                                        <div>
                                                            <strong>Salaire :</strong>{" "}
                                                            {extractedData.salaryAmount}
                                                            {extractedData.salaryNegotiable && " - Négociable"}
                                                        </div>
                                                        <div>
                                                            <strong>Date limite :</strong>{" "}
                                                            {extractedData.deadline}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div></div>
        </RecruiterLayout>
  </>
       
    );
}