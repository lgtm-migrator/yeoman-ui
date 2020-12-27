import * as vscode from "vscode";
import * as _ from "lodash";
import * as path from "path";
import { ExploreGens } from "../exploregens";
import { AbstractWebviewPanel } from "./AbstractWebviewPanel";
import { RpcExtension } from "@sap-devx/webview-rpc/out.ext/rpc-extension";


export class ExploreGensPanel extends AbstractWebviewPanel {
    public setWebviewPanel(webviewPanel: vscode.WebviewPanel) {
        super.setWebviewPanel(webviewPanel);
        this.rpc = new RpcExtension(webviewPanel.webview);
        this.exploreGens.init(this.rpc);
        this.initWebviewPanel();
    }

    private readonly exploreGens: ExploreGens;

    public constructor(context: vscode.ExtensionContext) {
        super(context);
        this.viewType = "exploreGens";
        this.viewTitle = "Explore and Install Generators";
        this.focusedKey = "exploreGens.Focused";
        this.htmlFileName = path.join("exploregens", "index.html");
        this.exploreGens = new ExploreGens(this.logger, this.isInBAS, this.context, vscode);
	}

    public loadWebviewPanel() {
		if (this.webViewPanel) {
			this.webViewPanel.reveal();
		} else {
            super.loadWebviewPanel();
		}
    }
    
    public async runGenerator() {
        const generators: string[] = await this.exploreGens.getAllInstalledGenerators(true);
        const generator = await vscode.window.showQuickPick(generators);
        vscode.commands.executeCommand("loadYeomanUI", {
            generator
        });
    }

    public disposeWebviewPanel() {
        super.disposeWebviewPanel();
    }
}
